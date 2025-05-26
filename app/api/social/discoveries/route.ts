export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

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
    
    const discoveries = await prisma.sharedDiscovery.findMany({
      where: { isPublic: true },
      include: {
        agent: {
          include: {
            user: {
              select: {
                username: true,
                profilePicture: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return NextResponse.json({ discoveries });
  } catch (error) {
    console.error('Get discoveries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    
    const { agentId, discoveryType, content, metadata, isPublic } = await request.json();
    
    // Verify agent belongs to user
    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        userId: payload.userId
      }
    });
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    
    const discovery = await prisma.sharedDiscovery.create({
      data: {
        agentId,
        discoveryType,
        content,
        metadata: metadata || {},
        isPublic: isPublic || false
      }
    });
    
    return NextResponse.json({ discovery });
  } catch (error) {
    console.error('Create discovery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}