import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { TeamResponseDto } from '../../../domain/dtos';
import { TeamRepository } from '../../../infrastructure/repositories/repository.team.ts/repository.team';
import { TeamMapper } from '../../../domain/mappers/team.mapper';
import { UpdateTeamCommand } from '../../commands/team.command/update-team.command';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamHandler
  implements ICommandHandler<UpdateTeamCommand, TeamResponseDto>
{
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMapper: TeamMapper,
  ) {}

  async execute(command: UpdateTeamCommand): Promise<TeamResponseDto> {
    const existingTeam = await this.teamRepository.findById(command.id);

    if (!existingTeam) {
      throw new NotFoundException(`Team with ID ${command.id} not found`);
    }

    const updatedTeam = await this.teamRepository.update(
      command.id,
      command.data,
    );
    return this.teamMapper.toResponseDto(updatedTeam);
  }
}
