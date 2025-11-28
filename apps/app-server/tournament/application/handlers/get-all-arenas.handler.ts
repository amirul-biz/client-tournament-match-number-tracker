import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllArenasQuery } from '../queries';
import { ArenaRepository } from '../../infrastructure/repositories/arena.repository';
import { Arena } from '../../../../../generated/prisma/client';

@QueryHandler(GetAllArenasQuery)
export class GetAllArenasHandler implements IQueryHandler<GetAllArenasQuery> {
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(): Promise<Arena[]> {
    return this.arenaRepository.findAll();
  }
}
