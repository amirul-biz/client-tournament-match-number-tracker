import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArenaModule } from '../../tournament/presentation/presentation.arena/arena.module';

@Module({
  imports: [ArenaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
