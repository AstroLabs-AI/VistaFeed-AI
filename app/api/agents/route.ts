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
    
    const agents = await prisma.agent.findMany({
      where: { userId: payload.userId },
      include: {
        memories: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            memories: true,
            discoveries: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
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
    
    const { agentName, agentType, configuration } = await request.json();
    
    if (!agentName || !agentType) {
      return NextResponse.json(
        { error: 'Agent name and type are required' },
        { status: 400 }
      );
    }
    
    const agent = await prisma.agent.create({
      data: {
        userId: payload.userId,
        agentName,
        agentType,
        configuration: configuration || {},
        lastActive: new Date(),
      }
    });
    
    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}