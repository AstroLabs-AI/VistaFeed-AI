// YouTube API integration using the YouTube Data API v3
// Documentation: https://developers.google.com/youtube/v3/docs

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: Date;
  channel: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface YouTubeSearchParams {
  query: string;
  maxResults?: number;
  order?: 'relevance' | 'date' | 'rating' | 'viewCount';
  duration?: 'short' | 'medium' | 'long';
}

// Helper function to convert ISO 8601 duration to readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export class YouTubeAPI {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey?: string) {
    // Use provided key or environment variable
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('YouTube API key not found. Please set YOUTUBE_API_KEY environment variable.');
    }
  }

  async searchVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    try {
      console.log('YouTube API searchVideos called with:', params);
      console.log('API Key available:', !!this.apiKey);
      
      // Search for videos
      const searchUrl = `${this.baseUrl}/search?part=snippet&type=video&maxResults=${params.maxResults || 10}&q=${encodeURIComponent(params.query)}&key=${this.apiKey}`;
      console.log('Fetching from YouTube:', searchUrl.replace(this.apiKey, 'HIDDEN'));
      
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        throw new Error(`YouTube API search request failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Get video IDs for fetching additional details
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      // Get video details including statistics and content details
      const videosUrl = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`;
      const videosResponse = await fetch(videosUrl);
      
      if (!videosResponse.ok) {
        throw new Error(`YouTube API videos request failed: ${videosResponse.statusText}`);
      }

      const videosData = await videosResponse.json();
      
      // Get channel details for avatars
      const channelIdsSet = new Set<string>();
      videosData.items.forEach((item: any) => {
        channelIdsSet.add(item.snippet.channelId);
      });
      const channelIds = Array.from(channelIdsSet).join(',');
      const channelsUrl = `${this.baseUrl}/channels?part=snippet&id=${channelIds}&key=${this.apiKey}`;
      const channelsResponse = await fetch(channelsUrl);
      
      if (!channelsResponse.ok) {
        throw new Error(`YouTube API channels request failed: ${channelsResponse.statusText}`);
      }

      const channelsData = await channelsResponse.json();
      
      // Create a map of channel IDs to avatar URLs
      const channelAvatars = new Map();
      channelsData.items.forEach((channel: any) => {
        channelAvatars.set(
          channel.id,
          channel.snippet.thumbnails.default?.url || 'https://i.imgur.com/9X06p5R.png' // Default avatar if none exists
        );
      });

      // Process the video data and return in our app's format
      return videosData.items.map((item: any) => {
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          duration: formatDuration(item.contentDetails.duration),
          views: parseInt(item.statistics.viewCount) || 0,
          likes: parseInt(item.statistics.likeCount) || 0,
          publishedAt: new Date(item.snippet.publishedAt),
          channel: {
            id: item.snippet.channelId,
            name: item.snippet.channelTitle,
            avatar: channelAvatars.get(item.snippet.channelId) || 'https://i.imgur.com/9X06p5R.png',
          },
        };
      });
    } catch (error) {
      console.error('Error fetching videos from YouTube API:', error);
      return [];
    }
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {

      // Get video details
      const videoUrl = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`;
      const videoResponse = await fetch(videoUrl);
      
      if (!videoResponse.ok) {
        throw new Error(`YouTube API video request failed: ${videoResponse.statusText}`);
      }

      const videoData = await videoResponse.json();
      
      if (!videoData.items || videoData.items.length === 0) {
        return null;
      }

      const item = videoData.items[0];
      
      // Get channel details for avatar
      const channelUrl = `${this.baseUrl}/channels?part=snippet&id=${item.snippet.channelId}&key=${this.apiKey}`;
      const channelResponse = await fetch(channelUrl);
      
      if (!channelResponse.ok) {
        throw new Error(`YouTube API channel request failed: ${channelResponse.statusText}`);
      }

      const channelData = await channelResponse.json();
      let channelAvatar = 'https://i.imgur.com/9X06p5R.png'; // Default avatar
      
      if (channelData.items && channelData.items.length > 0) {
        channelAvatar = channelData.items[0].snippet.thumbnails.default?.url || channelAvatar;
      }

      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: formatDuration(item.contentDetails.duration),
        views: parseInt(item.statistics.viewCount) || 0,
        likes: parseInt(item.statistics.likeCount) || 0,
        publishedAt: new Date(item.snippet.publishedAt),
        channel: {
          id: item.snippet.channelId,
          name: item.snippet.channelTitle,
          avatar: channelAvatar,
        },
      };
    } catch (error) {
      console.error('Error fetching video details from YouTube API:', error);
      return null;
    }
  }

  async getVideoCaptions(videoId: string): Promise<string[]> {
    try {

      // Get caption tracks
      const captionsUrl = `${this.baseUrl}/captions?part=snippet&videoId=${videoId}&key=${this.apiKey}`;
      const captionsResponse = await fetch(captionsUrl);
      
      if (!captionsResponse.ok) {
        throw new Error(`YouTube API captions request failed: ${captionsResponse.statusText}`);
      }

      const captionsData = await captionsResponse.json();
      
      // Note: Actually getting the caption content would require additional steps
      // with OAuth2 authentication, which is beyond the scope of this implementation.
      // For now, we'll return a placeholder message
      
      return [
        'Captions for this video are available.',
        'To fetch actual caption content, the app needs OAuth2 authentication.',
        'YouTube Data API requires special permissions for caption download.'
      ];
    } catch (error) {
      console.error('Error fetching video captions from YouTube API:', error);
      return [];
    }
  }

  async getVideoComments(videoId: string, maxResults: number = 20): Promise<any[]> {
    try {

      const commentsUrl = `${this.baseUrl}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${this.apiKey}`;
      const commentsResponse = await fetch(commentsUrl);
      
      if (!commentsResponse.ok) {
        throw new Error(`YouTube API comments request failed: ${commentsResponse.statusText}`);
      }

      const commentsData = await commentsResponse.json();
      
      if (!commentsData.items || commentsData.items.length === 0) {
        return [];
      }

      return commentsData.items.map((item: any) => {
        const comment = item.snippet.topLevelComment.snippet;
        return {
          id: item.id,
          text: comment.textDisplay,
          author: comment.authorDisplayName,
          authorProfileImage: comment.authorProfileImageUrl,
          publishedAt: new Date(comment.publishedAt),
          likeCount: comment.likeCount,
        };
      });
    } catch (error) {
      console.error('Error fetching video comments from YouTube API:', error);
      return [];
    }
  }
}

export const youtubeAPI = new YouTubeAPI();

// Export convenience functions
export const searchVideos = (params: YouTubeSearchParams) => youtubeAPI.searchVideos(params);
export const getVideoDetails = (videoId: string) => youtubeAPI.getVideoDetails(videoId);
export const getVideoCaptions = (videoId: string) => youtubeAPI.getVideoCaptions(videoId);
export const getVideoComments = (videoId: string, maxResults?: number) => youtubeAPI.getVideoComments(videoId, maxResults);