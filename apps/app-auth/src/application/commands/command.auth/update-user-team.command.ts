import { UpdateUserTeamDto } from '../../../domain/dtos';

export class UpdateUserTeamCommand {
  constructor(public readonly data: UpdateUserTeamDto) {}
}
