import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PresentationTeamController } from './presentation.team.controller';
import { TeamRepository } from '../../infrastructure/repositories/repository.team.ts/repository.team';
import { TeamMapper } from '../../domain/mappers/team.mapper';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { CreateTeamHandler } from '../../application/handlers/handler.team/create-team.handler';
import { UpdateTeamHandler } from '../../application/handlers/handler.team/update-team.handler';
import { DeleteTeamHandler } from '../../application/handlers/handler.team/delete-team.handler';
import { GetAllTeamsHandler } from '../../application/handlers/handler.team/get-all-team.handler';
import { GetTeamByIdHandler } from '../../application/handlers/handler.team/get-team-by-id.handler';

const CommandHandlers = [
  CreateTeamHandler,
  UpdateTeamHandler,
  DeleteTeamHandler,
];

const QueryHandlers = [
  GetAllTeamsHandler,
  GetTeamByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [PresentationTeamController],
  providers: [
    PrismaService,
    TeamRepository,
    TeamMapper,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class TeamModule {}
