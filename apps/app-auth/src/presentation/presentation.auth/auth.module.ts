import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../../infrastructure/database';
import { AuthRepository } from '../../infrastructure/repositories';
import { AuthMapper } from '../../domain/mappers';
import {
  LoginGoogleHandler,
  GetProfileHandler,
} from '../../application/handlers';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AuthGuard } from '@libs';

const CommandHandlers = [LoginGoogleHandler];
const QueryHandlers = [GetProfileHandler];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    AuthRepository,
    AuthMapper,
    GoogleStrategy,
    GoogleOauthGuard,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [AuthRepository],
})
export class AuthModule {}
