import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TeamEventsController } from './team-events.controller';
import { RmqClientModule } from '../../infrastructure/rmq';
import { DatabaseModule } from '../../infrastructure/database';
import { AuthRepository } from '../../infrastructure/repositories';
import { UpdateUserTeamHandler } from '../../application/handlers';

const CommandHandlers = [UpdateUserTeamHandler];

@Module({
  imports: [CqrsModule, RmqClientModule, DatabaseModule],
  controllers: [TeamEventsController],
  providers: [AuthRepository, ...CommandHandlers],
})
export class TeamEventsModule {}
