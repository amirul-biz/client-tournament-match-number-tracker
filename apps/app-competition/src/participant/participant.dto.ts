import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateParticipantDto {
  @ApiProperty({
    description: 'Participant name',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name!: string;

  @ApiProperty({
    description: 'Team ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  teamId!: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}
