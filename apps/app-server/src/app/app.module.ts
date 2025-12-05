import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArenaModule } from '../../tournament/presentation/presentation.arena/arena.module';
import { TeamModule } from '../../tournament/presentation/presentation.team/team.module';

@Module({
  imports: [ArenaModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
