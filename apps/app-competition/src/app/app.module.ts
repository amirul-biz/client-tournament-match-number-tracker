import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../../tournament/infrastructure/database';
import { ArenaModule } from '../arena/arena.module';
import { TeamModule } from '../team/team.module';
import { CategoryModule } from '../category/category.module';
import { ParticipantModule } from '../participant/participant.module';

@Module({
  imports: [
    DatabaseModule,
    ArenaModule,
    TeamModule,
    CategoryModule,
    ParticipantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
