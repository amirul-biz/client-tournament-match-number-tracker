import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ArenaController } from './arena.controller';
import { ArenaRepository } from '../../infrastructure/repositories/repository.arena/arena.repository';
import { PrismaService } from '../../../src/prisma/prisma.service';
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
  imports: [CqrsModule],
  controllers: [ArenaController],
  providers: [
    PrismaService,
    ArenaRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class ArenaModule {}
