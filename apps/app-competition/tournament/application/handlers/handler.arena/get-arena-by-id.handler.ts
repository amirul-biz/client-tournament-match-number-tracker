import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetArenaByIdQuery } from '../../queries';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { ArenaResponseDto } from '../../../domain/dtos';
import { ArenaMapper } from '../../../domain/mappers';

@QueryHandler(GetArenaByIdQuery)
export class GetArenaByIdHandler
  implements IQueryHandler<GetArenaByIdQuery, ArenaResponseDto>
{
  constructor(
    private readonly arenaRepository: ArenaRepository,
    private readonly arenaMapper: ArenaMapper,
  ) {}

  async execute(query: GetArenaByIdQuery): Promise<ArenaResponseDto> {
    const arena = await this.arenaRepository.findById(query.id);

    if (!arena) {
      throw new NotFoundException(`Arena with ID ${query.id} not found`);
    }

    return this.arenaMapper.toResponseDto(arena);
  }
}
