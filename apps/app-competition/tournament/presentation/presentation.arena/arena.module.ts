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
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '@libs';

const CommandHandlers = [CreateArenaHandler, UpdateArenaHandler, DeleteArenaHandler];

const QueryHandlers = [GetAllArenasHandler, GetArenaByIdHandler];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'],
    }),
  ],
  controllers: [ArenaController],
  providers: [AuthGuard, ArenaRepository, ArenaMapper, ...CommandHandlers, ...QueryHandlers],
})
export class ArenaModule {}
