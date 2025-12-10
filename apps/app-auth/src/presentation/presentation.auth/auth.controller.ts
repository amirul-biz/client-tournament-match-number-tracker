import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LoginGoogleCommand } from '../../application/commands';
import { GetProfileQuery } from '../../application/queries';
import { AuthResponseDto, ProfileResponseDto, GoogleUserDto } from '../../domain/dtos';
import { AuthGuard, setAuthCookies } from '@libs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to Google OAuth consent page',
  })
  async googleAuth() {
    // Guard handles the redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Google OAuth callback handler' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirects to client with auth cookies set',
  })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as Express.OAuthUser;

    const googleUserDto: GoogleUserDto = {
      googleId: googleUser.providerId,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
    };

    // Execute login command
    const authResponse = await this.commandBus.execute<
      LoginGoogleCommand,
      AuthResponseDto
    >(new LoginGoogleCommand(googleUserDto));

    // Set cookies using centralized auth config
    setAuthCookies(res, authResponse.accessToken, authResponse.refreshToken);

    // Redirect to client
    const clientHomeUrl =
      process.env['CLIENT_URL'] || 'http://localhost:4200';
    return res.redirect(clientHomeUrl);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getProfile(@Req() req: Request): Promise<ProfileResponseDto> {
    const user = req.user as Express.User;
    if (!user?.id) {
      throw new Error('User ID not found in token');
    }
    return this.queryBus.execute<GetProfileQuery, ProfileResponseDto>(
      new GetProfileQuery(user.id)
    );
  }
}
