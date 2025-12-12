import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ArenaController } from './arena.controller';
import { ArenaService } from './arena.service';
import { DatabaseModule } from '../../tournament/infrastructure/database';
import { AuthGuard } from '@libs';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'],
    }),
  ],
  controllers: [ArenaController],
  providers: [ArenaService, AuthGuard],
})
export class ArenaModule {}
