import { ApiProperty } from '@nestjs/swagger';

export class ArenaResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the arena',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The name of the arena',
    example: 'Arena 1',
  })
  name!: string;
}
