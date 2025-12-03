import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllArenasQuery } from '../../queries';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { ArenaResponseDto } from '../../../domain/dtos';
import { ArenaMapper } from '../../../domain/mappers';

@QueryHandler(GetAllArenasQuery)
export class GetAllArenasHandler
  implements IQueryHandler<GetAllArenasQuery, ArenaResponseDto[]>
{
  constructor(
    private readonly arenaRepository: ArenaRepository,
    private readonly arenaMapper: ArenaMapper,
  ) {}

  async execute(): Promise<ArenaResponseDto[]> {
    const arenas = await this.arenaRepository.findAll();
    return this.arenaMapper.toResponseDtoArray(arenas);
  }
}
