export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { enhancedAIService } from '@/lib/ai-services';
import { getVideoDetails } from '@/lib/youtube-api';

export async function POST(request: NextRequest) {
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
    
    const { videoId, videoTitle, agentId } = await request.json();
    
    if (!videoId || !videoTitle) {
      return NextResponse.json(
        { error: 'Video ID and title are required' },
        { status: 400 }
      );
    }
    
    // Get video details from YouTube API
    let videoDescription = '';
    let thumbnailUrl = '';
    try {
      const videoDetails = await getVideoDetails(videoId);
      if (videoDetails) {
        videoDescription = videoDetails.description || '';
        thumbnailUrl = videoDetails.thumbnail || '';
      }
    } catch (error) {
      console.error('Failed to fetch video details:', error);
    }
    
    // Perform real AI analysis using the enhanced AI service
    const analysis = await enhancedAIService.analyzeVideoContent(
      videoId,
      videoTitle,
      videoDescription,
      undefined, // captions - would need YouTube transcript API
      thumbnailUrl
    );
    
    // Store video interaction - skip for demo mode
    if (userId !== 'demo-user') {
      try {
        await prisma.videoInteraction.create({
          data: {
            userId,
            videoId,
            interactionType: 'analyzed',
            data: {
              videoTitle,
              analysis: JSON.parse(JSON.stringify(analysis)), // Convert to plain object
              agentId
            }
          }
        });
        
        // If agentId is provided, store as agent memory
        if (agentId) {
          await prisma.agentMemory.create({
            data: {
              agentId,
              memoryType: 'video_analysis',
              content: `Analyzed video: ${videoTitle}`,
              metadata: {
                videoId,
                analysis: JSON.parse(JSON.stringify(analysis)) // Convert to plain object
              },
              importance: 0.8
            }
          });
        }
      } catch (dbError) {
        console.error('Database error (non-critical):', dbError);
        // Continue without database storage for demo
      }
    }
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Video analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}