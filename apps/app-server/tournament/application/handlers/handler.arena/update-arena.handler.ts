import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateArenaCommand } from '../../commands/command.arena/update-arena.command';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { Arena } from '../../../../../../generated/prisma/client';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateArenaCommand)
export class UpdateArenaHandler implements ICommandHandler<UpdateArenaCommand> {
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(command: UpdateArenaCommand): Promise<Arena> {
    const arena = await this.arenaRepository.findById(command.id);
    if (!arena) {
      throw new NotFoundException(`Arena with ID ${command.id} not found`);
    }
    return this.arenaRepository.update(command.id, command.data);
  }
}
