
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.conroller";
import { GoogleStrategy } from "./auth.google.stratergy";
import { TeamEventsController } from "./team-events.controller";

@Module({
  controllers: [AuthController, TeamEventsController],
  providers: [GoogleStrategy]
})
export class AuthModule {}