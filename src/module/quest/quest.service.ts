import { Inject, Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';

import { QuestRepositoryService } from '../repository/service/quest.repository.service';
import { BlockchainCoreService } from '../blockchain/blockchain.core.service';
import { GetResultRequest, StartRandomQuestResponse } from './dto/quest.dto';
import { QuestTokenReward } from 'src/constant/quest';
import { LogQuestEntity } from '../repository/entity/log-quest.entity';
import { LimitExceededError } from 'src/types/error/application-exceptions/409-conflict';
import { NoOngoingQuestError } from 'src/types/error/application-exceptions/400-bad-request';

@Injectable()
export class QuestService {
  private latency: number = 2000; // 퀘스트 응답/처리 등을 고려한 추가 시간, milliseconds
  constructor(
    private readonly questRepositoryService: QuestRepositoryService,

    @Inject(BlockchainCoreService)
    private readonly blockchainCoreService: BlockchainCoreService,
  ) {}

  async getRandomQuest(userId: number): Promise<StartRandomQuestResponse> {
    const logs =
      await this.questRepositoryService.findRewardReceivedLogsByUserId(userId);

    const quests = await this.questRepositoryService.findQuests(
      logs.map((e) => e.quest.id),
    );

    if (!quests.length) {
      throw new LimitExceededError();
    }

    const randomQuestIndex = Math.floor(Math.random() * quests.length);
    const quest = quests[randomQuestIndex];

    const log = await this.questRepositoryService.insertLog(userId, quest.id);

    return StartRandomQuestResponse.from(quest, log.id);
  }

  async getRandomQuestTmp(userId: number): Promise<StartRandomQuestResponse> {
    const quests = await this.questRepositoryService.findQuests([]);
    const randomQuestIndex = Math.floor(Math.random() * quests.length);
    const quest = quests[randomQuestIndex];

    const log = await this.questRepositoryService.insertLog(userId, quest.id);

    return StartRandomQuestResponse.from(quest, log.id);
  }

  async isAlreadyOngoing(
    userId: number,
  ): Promise<{ isAlreadyOngoing: boolean; log?: LogQuestEntity }> {
    const logs =
      await this.questRepositoryService.findNotCompletedLogsByUser(userId);
    // quest 가 삭제되어도, log 는 남아있기 때문에 quest !== null 일 경우만 체크
    if (logs.length && logs[0].quest) {
      const isTimedOut: boolean = dayjs().isAfter(
        dayjs(logs[0].createdAt).add(
          logs[0].quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      );

      return { isAlreadyOngoing: !isTimedOut, log: logs[0] };
    }

    return { isAlreadyOngoing: false };
  }

  async findLogByIdAndUser(
    id: number,
    userId: number,
  ): Promise<LogQuestEntity> {
    return await this.questRepositoryService.findLogByIdAndUser(id, userId);
  }

  async getResult(userId: number, params: GetResultRequest): Promise<boolean> {
    const { logId, answer } = params;
    const log = await this.questRepositoryService.findLogByIdAndUser(
      logId,
      userId,
    );
    if (!log || log.isCompleted) {
      throw new NoOngoingQuestError();
    }

    const isSucceeded: boolean =
      dayjs().isBefore(
        dayjs(log.createdAt).add(
          log.quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      ) && log.quest.answer === answer.map((e) => e.trim()).join(',');

    this.handleResult(isSucceeded, log);

    return isSucceeded;
  }

  async getResultTmp(
    userId: number,
    params: GetResultRequest,
  ): Promise<boolean> {
    const { logId, answer } = params;
    const log = await this.questRepositoryService.findLogByIdAndUser(
      logId,
      userId,
    );
    if (!log || log.isCompleted) {
      throw new NoOngoingQuestError();
    }

    const isSucceeded: boolean =
      dayjs().isBefore(
        dayjs(log.createdAt).add(
          log.quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      ) && log.quest.answer === answer.map((e) => e.trim()).join(',');

    return isSucceeded;
  }

  async handleResult(isSucceeded: boolean, log: LogQuestEntity) {
    log.isCompleted = true;
    log.isSucceeded = isSucceeded;

    if (isSucceeded) {
      try {
        await this.blockchainCoreService.mintDalToken(
          log.user.walletAddress,
          QuestTokenReward,
        );
        log.rewardReceived = true;
      } catch (err) {
        Logger.error(err, err.stack);
        log.rewardReceived = false;
      }
    }

    await this.questRepositoryService.updateLog(log);
  }

  async completeLog(log: LogQuestEntity): Promise<void> {
    log.isCompleted = true;
    await this.questRepositoryService.updateLog(log);
  }
}
