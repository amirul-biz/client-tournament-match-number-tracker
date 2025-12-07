import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArenaCommand } from '../../commands/command.arena/create-arena.command';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { ArenaResponseDto } from '../../../domain/dtos';
import { ArenaMapper } from '../../../domain/mappers';

@CommandHandler(CreateArenaCommand)
export class CreateArenaHandler
  implements ICommandHandler<CreateArenaCommand, ArenaResponseDto>
{
  constructor(
    private readonly arenaRepository: ArenaRepository,
    private readonly arenaMapper: ArenaMapper,
  ) {}

  async execute(command: CreateArenaCommand): Promise<ArenaResponseDto> {
    const arena = await this.arenaRepository.create(command.data);
    return this.arenaMapper.toResponseDto(arena);
  }
}
