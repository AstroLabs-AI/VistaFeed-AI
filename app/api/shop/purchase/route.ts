export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';

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
    
    const { itemId } = await request.json();
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    
    // Get item details
    const item = await prisma.shopItem.findUnique({
      where: { id: itemId, isActive: true }
    });
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Check if user already owns the item
    const existingInventory = await prisma.userInventory.findUnique({
      where: {
        userId_itemId: {
          userId: payload.userId,
          itemId
        }
      }
    });
    
    if (existingInventory) {
      return NextResponse.json({ error: 'Item already owned' }, { status: 409 });
    }
    
    // For this demo, we'll assume users have enough coins
    // In a real app, you'd check user's coin balance here
    
    // Add item to user's inventory
    const inventoryItem = await prisma.userInventory.create({
      data: {
        userId: payload.userId,
        itemId,
        isEquipped: false
      }
    });
    
    return NextResponse.json({ 
      message: 'Item purchased successfully',
      inventoryItem 
    });
  } catch (error) {
    console.error('Purchase item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}