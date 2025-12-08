import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ArenaController } from './arena.controller';
import { ArenaRepository } from '../../infrastructure/repositories/repository.arena/arena.repository';
import { ArenaMapper } from '../../domain/mappers';
import { DatabaseModule } from '../../infrastructure/database';
import {
  CreateArenaHandler,
  UpdateArenaHandler,
  DeleteArenaHandler,
  GetAllArenasHandler,
  GetArenaByIdHandler,
} from '../../application/handlers/index';

const CommandHandlers = [
  CreateArenaHandler,
  UpdateArenaHandler,
  DeleteArenaHandler,
];

const QueryHandlers = [
  GetAllArenasHandler,
  GetArenaByIdHandler,
];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [ArenaController],
  providers: [
    ArenaRepository,
    ArenaMapper,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class ArenaModule {}
