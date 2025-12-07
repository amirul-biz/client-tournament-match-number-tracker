import { UpdateTeamDto } from "../../../domain/dtos";

export class UpdateTeamCommand {
    constructor(public readonly id: string, public readonly data: UpdateTeamDto){}
}