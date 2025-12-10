import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {
  AUTH_CONFIG,
  JwtPayload,
  extractUserPayload,
  setAccessTokenCookie,
} from './auth.config';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = this.extractTokenFromCookie(request, AUTH_CONFIG.COOKIE_ACCESS_TOKEN);
    const refreshToken = this.extractTokenFromCookie(request, AUTH_CONFIG.COOKIE_REFRESH_TOKEN);

    // No tokens present - redirect to auth
    if (!accessToken || !refreshToken) {
      this.redirectToAuth(response);
      return false;
    }

    // Try to verify access token first
    const isAccessTokenValid = await this.verifyAccessToken(accessToken, request);
    if (isAccessTokenValid) {
      return true;
    }

    // Access token invalid, try refresh token
    return this.handleRefreshToken(refreshToken, request, response);
  }

  private extractTokenFromCookie(request: Request, tokenName: string): string | undefined {
    return request.cookies?.[tokenName];
  }

  private async verifyAccessToken(accessToken: string, request: Request): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
        secret: process.env['JWT_SECRET'],
      });

      request.user = payload;
      this.logger.log('Access token verified successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.warn('Access token verification failed:', errorMessage);
      return false;
    }
  }

  private async handleRefreshToken(
    refreshToken: string,
    request: Request,
    response: Response
  ): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env['JWT_SECRET'],
      });

      this.logger.log('Refresh token verified, issuing new access token');

      // Extract only user data, excluding JWT metadata (exp, iat, etc.)
      const userPayload = extractUserPayload(payload);

      const newAccessToken = this.jwtService.sign(userPayload, {
        secret: process.env['JWT_SECRET'],
        expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
      });

      setAccessTokenCookie(response, newAccessToken);

      request.user = payload;
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error('Refresh token verification failed:', errorMessage);
      this.redirectToAuth(response);
      return false;
    }
  }

  private redirectToAuth(response: Response): void {
    const authUrl = process.env['AUTH_SERVICE_URL'] || 'http://localhost:5000/api';
    response.redirect(`${authUrl}/auth/google`);
  }
}
