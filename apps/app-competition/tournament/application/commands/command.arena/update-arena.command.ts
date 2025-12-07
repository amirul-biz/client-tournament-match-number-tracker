import { UpdateArenaDto } from "../../../domain/dtos";

export class UpdateArenaCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateArenaDto
  ) {}
}
