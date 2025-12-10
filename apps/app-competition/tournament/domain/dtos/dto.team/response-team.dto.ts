import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TeamResponseDto {
  @ApiProperty({
    description: 'unique Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'The name of the team',
    example: 'Moi Taekwondo',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'The ID of the user who created this team',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  userId!: string;
}

