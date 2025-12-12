import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTeamDto {
  @ApiProperty({
    description: 'The team name',
    example: 'Team Alpha',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name!: string;

  // userId is set internally from the authenticated user, not from request body
  userId?: string;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
