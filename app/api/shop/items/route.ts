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
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const whereClause: any = { isActive: true };
    if (category && category !== 'all') {
      whereClause.itemType = category;
    }
    
    const items = await prisma.shopItem.findMany({
      where: whereClause,
      include: {
        inventory: {
          where: { userId: payload.userId },
          select: {
            isEquipped: true,
            acquiredAt: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Format items with ownership status
    const formattedItems = items.map(item => ({
      ...item,
      isOwned: item.inventory.length > 0,
      isEquipped: item.inventory.length > 0 ? item.inventory[0].isEquipped : false,
      inventory: undefined // Remove inventory from response
    }));
    
    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error('Get shop items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}