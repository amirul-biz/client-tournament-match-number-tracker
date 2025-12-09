import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserTeamCommand } from '../../commands';
import { AuthRepository } from '../../../infrastructure/repositories/repository.auth/auth.repository';

@CommandHandler(UpdateUserTeamCommand)
export class UpdateUserTeamHandler
  implements ICommandHandler<UpdateUserTeamCommand, void>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: UpdateUserTeamCommand): Promise<void> {
    const { userId, teamId, teamName } = command.data;

    // Check if user exists
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update user team info
    await this.authRepository.updateTeamInfo(userId, teamId, teamName);
  }
}
