// TODO: 부딪힘 및 성공 여부 백엔드에서 처리

import { Inject, Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { WebSocketService } from 'src/module/websocket/websocket.service';
import { QuestService } from '../quest.service';
import { Server, Socket } from 'socket.io';
import { WebSocketExceptionFilter } from 'src/filter/websocket-exception-filter';
import { LogIdAccessTokenGuard } from './log-id-access-token.guard';
import {
  CORRECT_JUMP_POINTS,
  DuksaeJumpMessagePattern as MessagePattern,
  MISSING_JUMP_PENALTY,
} from './constants/quest-duksaejump';
import {
  DuksaeJump,
  DuksaeJumpQuestData,
  StartDuksaeJumpMessageBody,
} from './dto/quest-duksaejump.dto';
import { CacheService } from 'src/module/cache/cache.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class QuestDuksaeJumpGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly webSocketService: WebSocketService,

    @Inject(CacheService)
    private readonly memory: CacheService,

    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  afterInit(server: any) {
    Logger.log('init', QuestDuksaeJumpGateWay.name);
  }

  handleConnection(client: any, ...args: any[]) {
    Logger.log(`Client connected: ${client.id}`);
    this.webSocketService.addClient(client);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
    this.webSocketService.removeClient(client);
  }

  @UseFilters(new WebSocketExceptionFilter())
  @UseGuards(LogIdAccessTokenGuard)
  @SubscribeMessage(MessagePattern.Inbound.Start)
  async handleStart(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: StartDuksaeJumpMessageBody,
  ): Promise<void> {
    const log = client.log;
    const quest: DuksaeJumpQuestData = JSON.parse(log.quest.quest);
    const questData = new DuksaeJump(data.logId, client.id, client.user?.id);
    const scoreKey = questData.scoreKey;

    const objects = ['tree', 'bird', 'rock']; // 장애물 종류
    let objectSpeed = quest.objectSpeed; // 장애물 생성 주기 (밀리초)

    // 동일한 logId 로 이미 퀘스트를 진행한 이력이 있는지 확인(중복 불가)
    const isAlreadyStarted = (await this.memory.find(scoreKey)) !== null;
    if (isAlreadyStarted) {
      throw new WsException('Already Started');
    }

    // 점수, 목숨 세팅
    await this.memory.set(scoreKey, 0);
    await this.memory.set(
      DuksaeJump.getHealthPointKey(client.id),
      quest.gameoverLimit,
    );

    // 이후 점수 계산을 위해 client id 와 score key 매핑
    await this.memory.set(client.id, scoreKey);

    // 합격 점수 컷 저장
    await this.memory.set(
      DuksaeJump.getPassingScoreKey(client.id),
      quest.passingScore,
    );

    // 덕새의 속도에 따라 장애물의 수명(ttl)을 동적으로 조정
    const calTtl = () => {
      return (data.gamePanelOffsetWidth / objectSpeed) * 1000;
    };

    // 최대 플레이 시간

    // 1. 속도 증가에 걸리는 총 시간
    let iterations = 0;
    while (quest.objectSpeed > quest.objectMaxSpeed) {
      quest.objectSpeed *= quest.speedIncreaseRate;
      iterations++;
    }
    const totalIncreaseTime = iterations * quest.speedIncreaseInterval;

    // 2. 평균 장애물 방출 시간
    const averageTtl = (quest.objectSpeed + quest.objectMaxSpeed) / 2;
    const averageEmit = (data.gamePanelOffsetWidth / averageTtl) * 1000;

    // 3. 장애물 넘는 데 필요한 시간 (passingScore + gameoverLimit)
    const totalObjects = quest.passingScore + quest.gameoverLimit;
    const timeToPassObjects = averageEmit * totalObjects;

    // 4. 총 플레이 시간 계산
    const maxPlayTime = totalIncreaseTime + timeToPassObjects;

    // 장애물의 속도 업데이트 (기존 장애물 포함)
    const updateObjectSpeeds = async () => {
      while (true) {
        const hp = parseFloat(
          await this.memory.find(DuksaeJump.getHealthPointKey(client.id)),
        );
        if (hp <= 0) {
          return;
        }

        // 덕새 속도가 점점 빨라짐
        objectSpeed = Math.max(
          quest.objectMaxSpeed,
          objectSpeed * quest.speedIncreaseRate,
        );
        await this.memory.set(
          DuksaeJump.getObjectSpeedKey(client.id),
          objectSpeed,
        );

        // 장애물 속도 업데이트
        await new Promise((resolve) =>
          setTimeout(resolve, quest.speedIncreaseInterval),
        );
      }
    };

    // 점점 빠르게 장애물 emit
    const emitObject = async () => {
      while (true) {
        const hp = parseFloat(
          await this.memory.find(DuksaeJump.getHealthPointKey(client.id)),
        );
        if (hp <= 0) {
          return;
        }

        const randomObject =
          objects[Math.floor(Math.random() * objects.length)];

        client.emit(MessagePattern.Outbound.Object, randomObject);
        client.emit(MessagePattern.Outbound.Speed, objectSpeed);

        // 새로운 장애물의 속도에 맞춘 ttl 설정
        const ttl = calTtl();

        // 장애물 ttl 후 다음 장애물 등장
        await new Promise((resolve) => setTimeout(resolve, ttl));
      }
    };

    // maxPlayTime 후엔 게임 종료 후 승패 판단
    setTimeout(async () => {
      const hp = parseFloat(
        await this.memory.find(DuksaeJump.getHealthPointKey(client.id)),
      );
      if (hp > 0) {
        const data = JSON.parse(await this.memory.find(scoreKey));
        const score = parseFloat(data.score);

        const isSucceeded: boolean = score >= quest.passingScore;
        client.emit(MessagePattern.Outbound.Result, {
          result: isSucceeded,
          score,
        });
        await this.questService.handleResult(isSucceeded, log);
      }
    }, maxPlayTime);

    await Promise.all([updateObjectSpeeds(), emitObject()]);
  }

  @SubscribeMessage(MessagePattern.Inbound.Success)
  async handleSuccess(
    @ConnectedSocket()
    client: Socket,
  ): Promise<void> {
    const scoreKey = await this.memory.find(client.id);

    const score = await this.memory.incrbyfloat(scoreKey, CORRECT_JUMP_POINTS);
    client.emit(MessagePattern.Outbound.Score, score);

    const passingScore = parseFloat(
      await this.memory.find(DuksaeJump.getPassingScoreKey(client.id)),
    );
    const isSucceeded: boolean = score >= passingScore;
    if (isSucceeded) {
      client.emit(MessagePattern.Outbound.Result, {
        result: isSucceeded,
        score,
      });
    }
  }

  @SubscribeMessage(MessagePattern.Inbound.Fail)
  async handleFail(
    @ConnectedSocket()
    client: Socket,
  ): Promise<void> {
    const hp = await this.memory.incrbyfloat(
      DuksaeJump.getHealthPointKey(client.id),
      -MISSING_JUMP_PENALTY,
    );

    if (hp <= 0) {
      const scoreKey = await this.memory.find(client.id);
      const score = await this.memory.find(scoreKey);
      client.emit(MessagePattern.Outbound.GameOver, score);
      this.handleDisconnect(client);
    } else {
      client.emit(MessagePattern.Outbound.Health, hp);
    }
  }
}
