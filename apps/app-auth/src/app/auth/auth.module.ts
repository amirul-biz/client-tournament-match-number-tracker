
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.conroller";
import { GoogleStrategy } from "./auth.google.stratergy";

@Module({
  controllers: [AuthController],
  providers: [GoogleStrategy]
})
export class AuthModule {}