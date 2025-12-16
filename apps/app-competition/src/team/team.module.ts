import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { DatabaseModule } from '../../tournament/infrastructure/database';
import { RmqClientModule } from '../../tournament/infrastructure/rmq/rmq.module';
import { AuthGuard } from '@libs';

@Module({
  imports: [
    DatabaseModule,
    RmqClientModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
    }),
  ],
  controllers: [TeamController],
  providers: [TeamService, AuthGuard],
})
export class TeamModule {}
