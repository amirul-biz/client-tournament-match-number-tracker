import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateArenaCommand } from '../../commands/command.arena/update-arena.command';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { ArenaResponseDto } from '../../../domain/dtos';
import { ArenaMapper } from '../../../domain/mappers';

@CommandHandler(UpdateArenaCommand)
export class UpdateArenaHandler
  implements ICommandHandler<UpdateArenaCommand, ArenaResponseDto>
{
  constructor(
    private readonly arenaRepository: ArenaRepository,
    private readonly arenaMapper: ArenaMapper,
  ) {}

  async execute(command: UpdateArenaCommand): Promise<ArenaResponseDto> {
    const existingArena = await this.arenaRepository.findById(command.id);

    if (!existingArena) {
      throw new NotFoundException(`Arena with ID ${command.id} not found`);
    }

    const updatedArena = await this.arenaRepository.update(
      command.id,
      command.data,
    );
    return this.arenaMapper.toResponseDto(updatedArena);
  }
}
