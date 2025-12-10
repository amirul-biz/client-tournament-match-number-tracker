import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

export interface JwtPayload {
  id: string;
  googleId: string;
  name: string;
  teamId?: string;
  teamName?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly ACCESS_TOKEN_EXPIRY = '5m';
  private readonly ACCESS_TOKEN_EXPIRY_MS = 5 * 60 * 1000;

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = this.extractTokenFromCookie(request, 'access_token');
    const refreshToken = this.extractTokenFromCookie(request, 'refresh_token');

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
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env['JWT_SECRET'],
      });

      this.logger.log('Refresh token verified, issuing new access token');

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
      });

      this.setAccessTokenCookie(response, newAccessToken);

      request.user = payload;
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error('Refresh token verification failed:', errorMessage);
      this.redirectToAuth(response);
      return false;
    }
  }

  private setAccessTokenCookie(response: Response, token: string): void {
    response.cookie('access_token', token, {
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      domain: 'localhost',
      expires: new Date(Date.now() + this.ACCESS_TOKEN_EXPIRY_MS),
    });
  }

  private redirectToAuth(response: Response): void {
    const authUrl = process.env['AUTH_SERVICE_URL'] || 'http://localhost:5000/api';
    response.redirect(`${authUrl}/auth/google`);
  }
}
