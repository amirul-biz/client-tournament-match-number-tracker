import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArenaDto {
  @ApiProperty({
    description: 'The name of the arena',
    example: 'Updated Arena Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
