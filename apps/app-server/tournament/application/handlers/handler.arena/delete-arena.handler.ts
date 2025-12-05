import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { DeleteArenaCommand } from '../../commands';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';

@CommandHandler(DeleteArenaCommand)
export class DeleteArenaHandler
  implements ICommandHandler<DeleteArenaCommand, void>
{
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(command: DeleteArenaCommand): Promise<void> {
    const existingArena = await this.arenaRepository.findById(command.id);

    if (!existingArena) {
      throw new NotFoundException(`Arena with ID ${command.id} not found`);
    }

    await this.arenaRepository.delete(command.id);
    // No return - matches HTTP 204 No Content
  }
}
