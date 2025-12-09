import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Google ID',
    example: '1234567890',
  })
  @Expose()
  googleId!: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Team ID if user belongs to a team',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  teamId?: string;

  @ApiProperty({
    description: 'Team name if user belongs to a team',
    example: 'Team Alpha',
    required: false,
  })
  @Expose()
  teamName?: string;
}
