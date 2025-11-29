import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArenaCommand } from '../../commands/command.arena/create-arena.command';
import { ArenaRepository } from '../../../infrastructure/repositories/repository.arena/arena.repository';
import { Arena } from '../../../../../../generated/prisma/client';

@CommandHandler(CreateArenaCommand)
export class CreateArenaHandler implements ICommandHandler<CreateArenaCommand> {
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(command: CreateArenaCommand): Promise<Arena> {
    return this.arenaRepository.create(command.data);
  }
}
