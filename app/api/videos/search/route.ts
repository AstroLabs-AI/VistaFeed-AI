export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { youtubeAPI, YouTubeSearchParams } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const order = searchParams.get('order') as YouTubeSearchParams['order'] || 'relevance';
    const duration = searchParams.get('duration') as YouTubeSearchParams['duration'];
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    
    // Use the real YouTube API to search for videos
    const videos = await youtubeAPI.searchVideos({
      query,
      maxResults,
      order,
      duration
    });
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Video search error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}