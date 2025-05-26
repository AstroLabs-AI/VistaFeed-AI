export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { agentName, configuration, visualAssets } = await request.json();
    
    const agent = await prisma.agent.findFirst({
      where: {
        id: params.id,
        userId: payload.userId
      }
    });
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    
    const updatedAgent = await prisma.agent.update({
      where: { id: params.id },
      data: {
        agentName: agentName || agent.agentName,
        configuration: configuration || agent.configuration,
        visualAssets: visualAssets || agent.visualAssets,
        lastActive: new Date(),
      }
    });
    
    return NextResponse.json({ agent: updatedAgent });
  } catch (error) {
    console.error('Update agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const agent = await prisma.agent.findFirst({
      where: {
        id: params.id,
        userId: payload.userId
      }
    });
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    
    await prisma.agent.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}