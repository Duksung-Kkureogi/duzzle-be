import { Module } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { QuestAcidRainGateway } from './quest-acidrain.gateway';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { QuestModule } from 'src/module/quest/quest.module';

@Module({
  imports: [RepositoryModule, QuestModule],
  providers: [WebSocketService, QuestAcidRainGateway],
})
export class WebSocketModule {}
