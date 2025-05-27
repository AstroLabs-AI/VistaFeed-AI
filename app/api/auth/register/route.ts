export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateTokens } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email or username already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
        },
        select: {
          id: true,
          username: true,
          email: true,
          profilePicture: true,
        }
      });

      // Generate tokens
      const { accessToken, refreshToken } = await generateTokens({
        userId: user.id,
        username: user.username,
      });

      // Set refresh token as httpOnly cookie
      const response = NextResponse.json({
        user,
        accessToken,
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (dbError) {
      // If database is not available, create a demo user
      console.log('Database not available, creating demo user');
      
      const demoUser = {
        id: `demo-${Date.now()}`,
        username,
        email,
        profilePicture: null,
      };
      
      const { accessToken, refreshToken } = await generateTokens({
        userId: demoUser.id,
        username: demoUser.username,
      });
      
      const response = NextResponse.json({
        user: demoUser,
        accessToken,
        message: 'Demo user created (database not connected)'
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // More detailed error response for debugging
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Registration failed', 
          message: error.message,
          // Include more details in development
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}