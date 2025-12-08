import { Module } from "@nestjs/common";
import { ParticipantController } from "./participant.controller";
import { ParticipantService } from "./participant.service";
import { DatabaseModule } from "../../tournament/infrastructure/database";

@Module({
    imports: [DatabaseModule],
    controllers: [ParticipantController],
    providers: [ParticipantService]
})
export class ParticipantModule{}