export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { searchVideos } from '@/lib/youtube-api';
import { enhancedAIService } from '@/lib/ai-services';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // For demo mode, accept demo-token
    let userId = 'demo-user';
    if (token && token !== 'demo-token') {
      const payload = await verifyAccessToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      userId = payload.userId;
    }
    
    const { searchParams } = new URL(request.url);
    const diversityPreference = parseFloat(searchParams.get('diversity') || '0.5');
    
    // Get user's interests based on recent searches
    // For demo, we'll use predefined topics
    const userTopics = ['programming', 'machine learning', 'web development', 'artificial intelligence'];
    
    // Fetch videos from multiple topics for diversity
    const allVideos = [];
    for (const topic of userTopics.slice(0, 3)) { // Limit to 3 topics for performance
      const videos = await searchVideos({
        query: topic,
        maxResults: 5,
        order: 'relevance'
      });
      allVideos.push(...videos);
    }
    
    // Remove duplicates based on video ID
    const uniqueVideos = Array.from(
      new Map(allVideos.map(video => [video.id, video])).values()
    );
    
    // Generate AI recommendations for each video
    const recommendations = await Promise.all(
      uniqueVideos.slice(0, 6).map(async (video, index) => {
        // Analyze video for AI insights
        const analysis = await enhancedAIService.analyzeVideoContent(
          video.id,
          video.title,
          video.description
        );
        
        // Calculate relevance and diversity scores
        const relevanceScore = 0.7 + Math.random() * 0.3; // 70-100%
        const diversityScore = index < 3 ? 0.2 + Math.random() * 0.3 : 0.5 + Math.random() * 0.5;
        
        // Create agent recommendation
        const agentName = index % 2 === 0 ? 'TechExplorer' : 'LearnMaster';
        const agentType = index % 2 === 0 ? 'Content Analyzer' : 'Recommendation Agent';
        
        return {
          id: `rec-${video.id}`,
          videoId: video.id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          duration: video.duration,
          views: video.views,
          likes: video.likes,
          publishedAt: video.publishedAt,
          channel: video.channel,
          agentRecommendation: {
            agentName,
            agentType,
            relevanceScore,
            diversityScore,
            explanation: analysis.explanation.why_recommended,
            confidence: analysis.explanation.confidence_score,
            factors: analysis.explanation.factors
          },
          aiAnalysis: {
            topics: analysis.topics,
            difficulty: analysis.difficulty,
            engagement: analysis.engagement,
            quality: analysis.quality
          },
          socialSignals: {
            trending_score: Math.random() * 0.8 + 0.2,
            community_rating: 4 + Math.random(),
            co_watching_sessions: Math.floor(Math.random() * 50),
            poll_mentions: Math.floor(Math.random() * 20)
          }
        };
      })
    );
    
    // Sort by a combination of relevance and diversity
    recommendations.sort((a, b) => {
      const scoreA = a.agentRecommendation.relevanceScore * (1 - diversityPreference) + 
                     a.agentRecommendation.diversityScore * diversityPreference;
      const scoreB = b.agentRecommendation.relevanceScore * (1 - diversityPreference) + 
                     b.agentRecommendation.diversityScore * diversityPreference;
      return scoreB - scoreA;
    });
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}