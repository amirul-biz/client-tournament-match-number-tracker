import { Response } from 'express';

/**
 * Authentication configuration constants
 */
export const AUTH_CONFIG = {
  // Token expiration times
  ACCESS_TOKEN_EXPIRY: '10m',
  REFRESH_TOKEN_EXPIRY: '7d',

  // Token expiration in milliseconds
  ACCESS_TOKEN_EXPIRY_MS: 10 * 60 * 1000, // 10 minutes
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Cookie names
  COOKIE_ACCESS_TOKEN: 'access_token',
  COOKIE_REFRESH_TOKEN: 'refresh_token',

} as const;

/**
 * JWT payload interface for user authentication
 */
export interface JwtPayload {
  id: string;
  googleId: string;
  name: string;
  teamId?: string;
  teamName?: string;
}

/**
 * Cookie configuration options
 */
interface CookieOptions {
  secure?: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  expires: Date;
  httpOnly?: boolean;
  path?: string;
}

/**
 * Get cookie options for the given environment and expiration time
 *
 * TODO: Fix cross-port cookie authentication issue (localhost:4200 <-> localhost:5000)
 * Current workaround uses SameSite=none without Secure flag for development.
 * This requires disabling Chrome security flags or using Firefox.
 *
 * Permanent solutions to consider:
 * 1. Enable local HTTPS with self-signed certificates
 * 2. Use Angular proxy to serve frontend and backend on same port
 * 3. Update Google OAuth to use proxy callback URL (requires Google Console change)
 */
function getCookieOptions(expiresInMs: number): CookieOptions {
  const isProduction = process.env['NODE_ENV'] === 'production';

  if (isProduction) {
    // Production: Use secure cookies with SameSite=strict
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + expiresInMs),
    };
  } else {
    // Development: Use lax SameSite for cross-origin (localhost:4200 <-> localhost:5000)
    return {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      expires: new Date(Date.now() + expiresInMs),
    };
  }
}

/**
 * Set access token cookie in the response
 */
export function setAccessTokenCookie(response: Response, token: string): void {
  const options = getCookieOptions(AUTH_CONFIG.ACCESS_TOKEN_EXPIRY_MS);
  console.log('[Auth] Setting access token cookie with options:', options);
  response.cookie(
    AUTH_CONFIG.COOKIE_ACCESS_TOKEN,
    token,
    options
  );
}

/**
 * Set refresh token cookie in the response
 */
export function setRefreshTokenCookie(response: Response, token: string): void {
  const options = getCookieOptions(AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS);
  console.log('[Auth] Setting refresh token cookie with options:', options);
  response.cookie(
    AUTH_CONFIG.COOKIE_REFRESH_TOKEN,
    token,
    options
  );
}

/**
 * Set both access and refresh token cookies in the response
 */
export function setAuthCookies(response: Response, accessToken: string, refreshToken: string): void {
  setAccessTokenCookie(response, accessToken);
  setRefreshTokenCookie(response, refreshToken);
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(response: Response): void {
  response.clearCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN);
  response.clearCookie(AUTH_CONFIG.COOKIE_REFRESH_TOKEN);
}

/**
 * Extract clean user payload from JWT payload (removes JWT metadata)
 */
export function extractUserPayload(payload: any): JwtPayload {
  return {
    id: payload.id,
    googleId: payload.googleId,
    name: payload.name,
    ...(payload.teamId && { teamId: payload.teamId }),
    ...(payload.teamName && { teamName: payload.teamName }),
  };
}
