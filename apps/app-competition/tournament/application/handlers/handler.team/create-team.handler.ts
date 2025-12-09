import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamResponseDto } from '../../../domain/dtos';
import { TeamRepository } from '../../../infrastructure/repositories/repository.team.ts/repository.team';
import { TeamMapper } from '../../../domain/mappers/team.mapper';
import { CreateTeamCommand } from '../../commands/team.command/create-team.command';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(CreateTeamCommand)
export class CreateTeamHandler
  implements ICommandHandler<CreateTeamCommand, TeamResponseDto>
{
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMapper: TeamMapper,
    @Inject('AUTH_SERVICE_CLIENT') private readonly client: ClientProxy,
  ) {}

  async execute(command: CreateTeamCommand): Promise<TeamResponseDto> {
    const team = await this.teamRepository.create(command.data);
    const data =  this.teamMapper.toResponseDto(team);
    this.client.emit('team.created', data).subscribe({
      error: (err) => console.error('RabbitMQ emit error:', err),
    });
    Logger.log('data being', data)
    return data
  }
}