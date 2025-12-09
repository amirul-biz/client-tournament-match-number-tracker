import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../presentation/presentation.auth/auth.module';
import { TeamEventsModule } from '../presentation/presentation.events/team-events.module';
import { DatabaseModule } from '../infrastructure/database';

@Module({
  imports: [DatabaseModule, AuthModule, TeamEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
