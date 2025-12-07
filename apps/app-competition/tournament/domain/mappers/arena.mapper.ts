import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Arena } from '../../../generated/prisma';
import { ArenaResponseDto } from '../dtos/dto.arena/arena-response.dto';

@Injectable()
export class ArenaMapper {
  /**
   * Transforms a single Arena entity to ArenaResponseDto
   * @param arena - Prisma Arena model
   * @returns Strongly-typed ArenaResponseDto
   */
  toResponseDto(arena: Arena): ArenaResponseDto {
    return plainToInstance(ArenaResponseDto, arena, {
      excludeExtraneousValues: true, // Only include @Expose() decorated properties
    });
  }

  /**
   * Transforms an array of Arena entities to ArenaResponseDto[]
   * @param arenas - Array of Prisma Arena models
   * @returns Array of strongly-typed ArenaResponseDto
   */
  toResponseDtoArray(arenas: Arena[]): ArenaResponseDto[] {
    return arenas.map((arena) => this.toResponseDto(arena));
  }
}
