import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetArenaByIdQuery } from '../../queries';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { Arena } from '../../../../../../generated/prisma/client';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetArenaByIdQuery)
export class GetArenaByIdHandler implements IQueryHandler<GetArenaByIdQuery> {
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(query: GetArenaByIdQuery): Promise<Arena> {
    const arena = await this.arenaRepository.findById(query.id);
    if (!arena) {
      throw new NotFoundException(`Arena with ID ${query.id} not found`);
    }
    return arena;
  }
}
