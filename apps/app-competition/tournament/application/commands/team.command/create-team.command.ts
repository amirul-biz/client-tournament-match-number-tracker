import { CreateTeamDto } from "../../../domain/dtos";

export class CreateTeamCommand {
    constructor(public readonly data: CreateTeamDto) {}
}