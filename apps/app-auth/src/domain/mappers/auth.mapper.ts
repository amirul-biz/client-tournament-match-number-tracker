import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from '../../infrastructure/generated/prisma';
import { ProfileResponseDto, AuthResponseDto } from '../dtos';

@Injectable()
export class AuthMapper {
  toProfileResponseDto(user: User): ProfileResponseDto {
    return plainToInstance(ProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  toAuthResponseDto(
    user: User,
    accessToken: string,
    refreshToken: string
  ): AuthResponseDto {
    return plainToInstance(
      AuthResponseDto,
      {
        accessToken,
        refreshToken,
        userId: user.id,
        name: user.name
      },
      {
        excludeExtraneousValues: true,
      }
    );
  }
}
