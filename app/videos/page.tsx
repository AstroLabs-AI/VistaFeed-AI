'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Clock, Eye, ThumbsUp, Bot, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: Date;
  channel: {
    name: string;
    avatar: string;
  };
  aiAnalysis?: {
    summary: string;
    topics: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
}

// Initial empty array for videos
const initialVideos: Video[] = [];

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    // Fetch initial videos immediately
    fetchVideos('programming');
  }, []);
  
  // Fetch videos when search query changes (with debounce)
  useEffect(() => {
    if (searchQuery.length < 2) return;
    
    const debounceTimer = setTimeout(() => {
      fetchVideos(searchQuery);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  // Function to fetch videos from the YouTube API
  const fetchVideos = async (query: string) => {
    if (!query) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      console.log('Token:', token); // Debug log
      // Remove token check since we're in demo mode
      
      const params = new URLSearchParams({
        q: query,
        maxResults: '12',
        order: 'relevance'
      });
      
      const url = `/api/videos/search?${params.toString()}`;
      console.log('Fetching from:', url); // Debug log
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token || 'demo-token'}`
        }
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to fetch videos');
      }
      
      const data = await response.json();
      console.log('Videos received:', data.videos?.length); // Debug log
      
      // Parse dates properly
      const parsedVideos = (data.videos || []).map((video: any) => ({
        ...video,
        publishedAt: new Date(video.publishedAt)
      }));
      
      setVideos(parsedVideos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'analyzed') return matchesSearch && video.aiAnalysis;
    if (selectedFilter === 'recent') return matchesSearch && 
      (Date.now() - video.publishedAt.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days
    
    return matchesSearch;
  });

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (duration: string) => {
    return duration;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Video <span className="gradient-text">Discovery</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Search and analyze YouTube videos with AI-powered insights
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {['all', 'analyzed', 'recent'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
                disabled={isLoading}
              >
                <Filter className="w-4 h-4 mr-1" />
                {filter}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {/* Error message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-md mb-8"
          >
            <p className="flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </p>
            <p className="text-sm mt-2">
              Check the browser console for more details.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Videos</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{videos.length}</p>
                </div>
                <Play className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">AI Analyzed</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {videos.filter(v => v.aiAnalysis).length}
                  </p>
                </div>
                <Bot className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Views</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {formatViews(videos.reduce((sum, video) => sum + video.views, 0))}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Channel Info */}
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={video.channel.avatar}
                        alt={video.channel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {video.channel.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(video.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{formatViews(video.likes)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{video.publishedAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {video.aiAnalysis && (
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Analyzed
                        </Badge>
                        <Badge className={difficultyColors[video.aiAnalysis.difficulty]}>
                          {video.aiAnalysis.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {video.aiAnalysis.summary}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {video.aiAnalysis.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {video.aiAnalysis.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{video.aiAnalysis.topics.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch & Analyze
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No videos found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search query or filters
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => fetchVideos('programming tutorial')}
            >
              <Search className="w-4 h-4 mr-2" />
              Search YouTube
            </Button>
          </motion.div>
        )}
        
        {/* Loading state */}
        {isLoading && filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-gray-600 dark:text-gray-300">
              Fetching videos from YouTube...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}