import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({
    description: 'Participant name',
    example: 'John Doe',
  })
  name!: string;

  @ApiProperty({
    description: 'Team ID',
    example: '1',
  })
  teamId!: string;

  @ApiProperty({
    description: 'Category ID',
    example: '1',
  })
  categoryId!: string;
}
