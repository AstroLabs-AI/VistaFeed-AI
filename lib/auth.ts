import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'your-refresh-secret');

export interface TokenPayload extends JWTPayload {
  userId: string;
  username: string;
  [key: string]: any;
}

export async function hashPassword(password: string): Promise<string> {
  // Use Web Crypto API instead of bcryptjs for Edge Runtime compatibility
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt'); // Simple salt for demo
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

export async function generateTokens(payload: { userId: string; username: string }) {
  const jwtPayload: TokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
  };

  const accessToken = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .setIssuedAt()
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_REFRESH_SECRET);

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Type guard to ensure payload has required properties
    if (
      payload &&
      typeof payload === 'object' &&
      'userId' in payload &&
      'username' in payload &&
      typeof payload.userId === 'string' &&
      typeof payload.username === 'string'
    ) {
      return payload as TokenPayload;
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    
    // Type guard to ensure payload has required properties
    if (
      payload &&
      typeof payload === 'object' &&
      'userId' in payload &&
      'username' in payload &&
      typeof payload.userId === 'string' &&
      typeof payload.username === 'string'
    ) {
      return payload as TokenPayload;
    }
    
    return null;
  } catch {
    return null;
  }
}