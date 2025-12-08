import { Controller, Get, Inject, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './auth.o-auth.guard';
import { Request } from 'express';
import { EventPattern } from '@nestjs/microservices';
import { AuthRepository } from './repository.auth';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authRepository: AuthRepository, private jwtService: JwtService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request) {
    const user = req.user as {
      provider: string;
      providerId: string;
      email: string;
      name: string;
      picture: string;
    };

    const isUserExist = await this.authRepository.ifUserExist({ googleId: user.providerId });

    if (!isUserExist)
      await this.authRepository.createUser({ googleId: user.providerId, name: user.name });

    // This is where you'll handle the user data from Google

    //assume i will save the  jwt token and redirect to client side
    Logger.log(`req.user`);

    

    return {
      message: 'User information from Google',
      user: req.user,
      jwt: this.jwtService.sign(user)
    };
  }

  @EventPattern('team_created_pattern')
  async handleMessage(data: Record<string, any>) {
    console.log('Received message:', data);
    Logger.log(`Received message:${data}`);
    // Add your message processing logic here
  }
}
