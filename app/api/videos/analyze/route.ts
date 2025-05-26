export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

// Mock AI analysis function
const mockAnalyzeVideo = async (videoId: string, videoTitle: string) => {
  // In a real implementation, this would use AI services to analyze the video
  const mockAnalysis = {
    summary: `Comprehensive analysis of "${videoTitle}" covering key concepts and practical applications.`,
    topics: ['Machine Learning', 'AI', 'Technology', 'Programming'],
    difficulty: 'Intermediate' as const,
    keyPoints: [
      'Introduction to core concepts',
      'Practical implementation examples',
      'Real-world applications',
      'Best practices and recommendations'
    ],
    sentiment: 'positive',
    duration: '15:30',
    quality: 'high'
  };
  
  return mockAnalysis;
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const { videoId, videoTitle, agentId } = await request.json();
    
    if (!videoId || !videoTitle) {
      return NextResponse.json(
        { error: 'Video ID and title are required' },
        { status: 400 }
      );
    }
    
    // Perform AI analysis
    const analysis = await mockAnalyzeVideo(videoId, videoTitle);
    
    // Store video interaction
    await prisma.videoInteraction.create({
      data: {
        userId: payload.userId,
        videoId,
        interactionType: 'analyzed',
        data: {
          videoTitle,
          analysis,
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
            analysis
          },
          importance: 0.8
        }
      });
    }
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Video analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}