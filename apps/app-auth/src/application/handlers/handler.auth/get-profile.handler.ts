import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetProfileQuery } from '../../queries';
import { AuthRepository } from '../../../infrastructure/repositories/repository.auth/auth.repository';
import { AuthMapper } from '../../../domain/mappers';
import { ProfileResponseDto } from '../../../domain/dtos';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler
  implements IQueryHandler<GetProfileQuery, ProfileResponseDto>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authMapper: AuthMapper
  ) {}

  async execute(query: GetProfileQuery): Promise<ProfileResponseDto> {
    const user = await this.authRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${query.userId} not found`);
    }

    return this.authMapper.toProfileResponseDto(user);
  }
}
