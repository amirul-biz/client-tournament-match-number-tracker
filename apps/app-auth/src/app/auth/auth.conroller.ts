import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './auth.o-auth.guard';
import { Request } from 'express';
import { EventPattern } from '@nestjs/microservices';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request) {
    // This is where you'll handle the user data from Google

    //assume i will save the  jwt token and redirect to client side
    Logger.log(`req.user`);

    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

  @EventPattern('team_created_pattern')
  async handleMessage(data: Record<string, any>) {
    console.log('Received message:', data);
    Logger.log(`Received message:${data}`)
    // Add your message processing logic here
  }
}
