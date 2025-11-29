import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteArenaCommand } from '../../commands';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { Arena } from '../../../../../../generated/prisma/client';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteArenaCommand)
export class DeleteArenaHandler implements ICommandHandler<DeleteArenaCommand> {
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(command: DeleteArenaCommand): Promise<Arena> {
    const arena = await this.arenaRepository.findById(command.id);
    if (!arena) {
      throw new NotFoundException(`Arena with ID ${command.id} not found`);
    }
    return this.arenaRepository.delete(command.id);
  }
}
