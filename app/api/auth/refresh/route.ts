export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokens } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify the refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    try {
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          username: true,
          email: true,
          profilePicture: true,
          isActive: true,
        }
      });

      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: 'User not found or inactive' },
          { status: 401 }
        );
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
        userId: user.id,
        username: user.username,
      });

      // Set new refresh token as httpOnly cookie
      const response = NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        accessToken,
      });

      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (dbError) {
      // If database is not available, but token is valid, return demo user
      console.log('Database not available, returning demo user');
      
      const demoUser = {
        id: payload.userId,
        username: payload.username,
        email: `${payload.username}@demo.com`,
        profilePicture: null,
      };
      
      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
        userId: demoUser.id,
        username: demoUser.username,
      });
      
      const response = NextResponse.json({
        user: demoUser,
        accessToken,
        message: 'Demo user (database not connected)'
      });

      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}