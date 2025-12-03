import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Team } from '../../../../../generated/prisma';
import { TeamResponseDto } from '../dtos/dto.team/response-team.dto';

@Injectable()
export class TeamMapper {
  /**
   * Transforms a single Team entity to TeamResponseDto
   * @param team - Prisma Team model
   * @returns Strongly-typed TeamResponseDto
   */
  toResponseDto(team: Team): TeamResponseDto {
    return plainToInstance(TeamResponseDto, team, {
      excludeExtraneousValues: true, // Only include @Expose() decorated properties
    });
  }

  /**
   * Transforms an array of Team entities to TeamResponseDto[]
   * @param teams - Array of Prisma Team models
   * @returns Array of strongly-typed TeamResponseDto
   */
  toResponseDtoArray(teams: Team[]): TeamResponseDto[] {
    return teams.map((team) => this.toResponseDto(team));
  }
}
