import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { TeamResponseDto } from '../../../domain/dtos';
import { TeamRepository } from '../../../infrastructure/repositories/repository.team.ts/repository.team';
import { TeamMapper } from '../../../domain/mappers/team.mapper';
import { GetTeamByIdQuery } from '../../queries/query.team/get-team-by-id.query';

@QueryHandler(GetTeamByIdQuery)
export class GetTeamByIdHandler
  implements IQueryHandler<GetTeamByIdQuery, TeamResponseDto>
{
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMapper: TeamMapper,
  ) {}

  async execute(query: GetTeamByIdQuery): Promise<TeamResponseDto> {
    const team = await this.teamRepository.findById(query.id);

    if (!team) {
      throw new NotFoundException(`Team with ID ${query.id} not found`);
    }

    return this.teamMapper.toResponseDto(team);
  }
}
