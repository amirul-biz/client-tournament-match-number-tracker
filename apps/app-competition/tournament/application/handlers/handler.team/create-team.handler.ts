import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamResponseDto } from '../../../domain/dtos';
import { TeamRepository } from '../../../infrastructure/repositories/repository.team.ts/repository.team';
import { TeamMapper } from '../../../domain/mappers/team.mapper';
import { CreateTeamCommand } from '../../commands/team.command/create-team.command';

@CommandHandler(CreateTeamCommand)
export class CreateTeamHandler
  implements ICommandHandler<CreateTeamCommand, TeamResponseDto>
{
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMapper: TeamMapper,
  ) {}

  async execute(command: CreateTeamCommand): Promise<TeamResponseDto> {
    const team = await this.teamRepository.create(command.data);
    return this.teamMapper.toResponseDto(team);
  }
}