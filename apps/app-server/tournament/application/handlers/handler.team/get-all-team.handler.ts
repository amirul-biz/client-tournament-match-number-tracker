import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllTeamsQuery } from '../../queries/query.team/get-all-teams.query';
import { TeamResponseDto } from '../../../domain/dtos';
import { TeamRepository } from '../../../infrastructure/repositories/repository.team.ts/repository.team';
import { TeamMapper } from '../../../domain/mappers/team.mapper';

@QueryHandler(GetAllTeamsQuery)
export class GetAllTeamsHandler
  implements IQueryHandler<GetAllTeamsQuery, TeamResponseDto[]>
{
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMapper: TeamMapper,
  ) {}

  async execute(): Promise<TeamResponseDto[]> {
    const teams = await this.teamRepository.findAll();
    return this.teamMapper.toResponseDtoArray(teams);
  }
}
