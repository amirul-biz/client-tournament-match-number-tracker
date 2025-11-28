import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArenaCommand } from '../commands';
import { ArenaRepository } from '../../infrastructure/repositories/arena.repository';
import { Arena } from '../../../../../generated/prisma/client';

@CommandHandler(CreateArenaCommand)
export class CreateArenaHandler implements ICommandHandler<CreateArenaCommand> {
  constructor(private readonly arenaRepository: ArenaRepository) {}

  async execute(command: CreateArenaCommand): Promise<Arena> {
    return this.arenaRepository.create(command.data);
  }
}
