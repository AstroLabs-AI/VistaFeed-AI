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
    
    const connections = await prisma.socialConnection.findMany({
      where: {
        OR: [
          { userId1: payload.userId },
          { userId2: payload.userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            agents: {
              select: { id: true }
            }
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            agents: {
              select: { id: true }
            }
          }
        }
      }
    });
    
    // Format connections to show the other user
    const formattedConnections = connections.map(conn => {
      const otherUser = conn.userId1 === payload.userId ? conn.user2 : conn.user1;
      return {
        id: conn.id,
        user: otherUser,
        status: conn.status,
        connectionType: conn.connectionType,
        createdAt: conn.createdAt,
        lastInteraction: conn.lastInteraction
      };
    });
    
    return NextResponse.json({ connections: formattedConnections });
  } catch (error) {
    console.error('Get connections error:', error);
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
    
    const { targetUserId, connectionType } = await request.json();
    
    if (!targetUserId || !connectionType) {
      return NextResponse.json(
        { error: 'Target user ID and connection type are required' },
        { status: 400 }
      );
    }
    
    // Check if connection already exists
    const existingConnection = await prisma.socialConnection.findFirst({
      where: {
        OR: [
          { userId1: payload.userId, userId2: targetUserId },
          { userId1: targetUserId, userId2: payload.userId }
        ],
        connectionType
      }
    });
    
    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 409 }
      );
    }
    
    const connection = await prisma.socialConnection.create({
      data: {
        userId1: payload.userId,
        userId2: targetUserId,
        connectionType,
        status: 'pending'
      }
    });
    
    return NextResponse.json({ connection });
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}