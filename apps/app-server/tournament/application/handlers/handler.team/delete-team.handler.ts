import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { DeleteTeamCommand } from '../../commands/team.command/delete-team.command';
import { TeamRepository } from '../../../infrastructure/repositories/repository.team.ts/repository.team';

@CommandHandler(DeleteTeamCommand)
export class DeleteTeamHandler
  implements ICommandHandler<DeleteTeamCommand, void>
{
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(command: DeleteTeamCommand): Promise<void> {
    const existingTeam = await this.teamRepository.findById(command.id);

    if (!existingTeam) {
      throw new NotFoundException(`Team with ID ${command.id} not found`);
    }

    await this.teamRepository.delete(command.id);
  }
}
