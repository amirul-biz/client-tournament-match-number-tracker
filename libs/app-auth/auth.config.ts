import { Response } from 'express';

/**
 * Authentication configuration constants
 */
export const AUTH_CONFIG = {
  // Token expiration times
  ACCESS_TOKEN_EXPIRY: '1s',
  REFRESH_TOKEN_EXPIRY: '7d',

  // Token expiration in milliseconds
  ACCESS_TOKEN_EXPIRY_MS:  1000, // 1 second
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Cookie names
  COOKIE_ACCESS_TOKEN: 'access_token',
  COOKIE_REFRESH_TOKEN: 'refresh_token',

  // Cookie options
  COOKIE_DOMAIN: 'localhost',
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
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  domain: string;
  expires: Date;
  httpOnly?: boolean;
}

/**
 * Get cookie options for the given environment and expiration time
 */
function getCookieOptions(expiresInMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    domain: AUTH_CONFIG.COOKIE_DOMAIN,
    expires: new Date(Date.now() + expiresInMs),
  };
}

/**
 * Set access token cookie in the response
 */
export function setAccessTokenCookie(response: Response, token: string): void {
  response.cookie(
    AUTH_CONFIG.COOKIE_ACCESS_TOKEN,
    token,
    getCookieOptions(AUTH_CONFIG.ACCESS_TOKEN_EXPIRY_MS)
  );
}

/**
 * Set refresh token cookie in the response
 */
export function setRefreshTokenCookie(response: Response, token: string): void {
  response.cookie(
    AUTH_CONFIG.COOKIE_REFRESH_TOKEN,
    token,
    getCookieOptions(AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS)
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
