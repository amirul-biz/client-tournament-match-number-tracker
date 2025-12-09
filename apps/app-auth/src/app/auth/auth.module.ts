
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.conroller";
import { GoogleStrategy } from "./auth.google.stratergy";
import { TeamEventsController } from "./team-events.controller";
import { AuthRepository } from "./repository.auth";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'],
    }),
  
  ],
  controllers: [AuthController, TeamEventsController],
  providers: [GoogleStrategy, AuthRepository, PrismaService],
  exports: [PrismaService]
})
export class AuthModule {}