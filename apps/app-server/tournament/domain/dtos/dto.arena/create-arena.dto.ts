import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArenaDto {
  @ApiProperty({
    description: 'The name of the arena',
    example: 'Arena 1',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;
}
