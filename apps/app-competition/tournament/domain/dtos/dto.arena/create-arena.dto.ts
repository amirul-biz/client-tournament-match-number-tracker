import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArenaDto {
  @ApiProperty({
    description: 'The name of the arena',
    example: 'Arena 1',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name!: string;
}
