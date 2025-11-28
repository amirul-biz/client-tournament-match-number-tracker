import { CreateArenaDto } from '../../domain/dtos';

export class CreateArenaCommand {
  constructor(public readonly data: CreateArenaDto) {}
}
