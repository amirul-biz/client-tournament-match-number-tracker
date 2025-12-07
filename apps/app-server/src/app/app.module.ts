import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArenaModule } from '../../tournament/presentation/presentation.arena/arena.module';
import { TeamModule } from '../../tournament/presentation/presentation.team/team.module';
import { ParticipantModule } from '../participant/participant.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ArenaModule, TeamModule, ParticipantModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
