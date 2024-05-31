import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { QuestRepositoryService } from '../repository/service/quest.repository.service';
import { BlockchainCoreService } from '../blockchain/blockchain.core.service';
import { GetResultRequest, StartRandomQuestResponse } from './dto/quest.dto';
import dayjs from 'dayjs';
import { QuestTokenReward } from 'src/constant/quest';

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
      throw new ServiceError(ExceptionCode.LimitExceeded);
    }

    const randomQuestIndex = Math.floor(Math.random() * quests.length);
    const quest = quests[randomQuestIndex];

    const log = await this.questRepositoryService.insertLog(userId, quest.id);

    return StartRandomQuestResponse.from(quest, log.id);
  }

  async isAlreadyOngoing(userId: number): Promise<boolean> {
    const logs =
      await this.questRepositoryService.findNotCompletedLogsByUser(userId);
    if (logs.length) {
      const isTimedOut: boolean = dayjs().isAfter(
        dayjs(logs[0].createdAt).add(
          logs[0].quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      );

      return !isTimedOut;
    }

    return false;
  }

  async getResult(userId: number, params: GetResultRequest): Promise<boolean> {
    const { logId, answer } = params;
    const log = await this.questRepositoryService.getLogByIdAndUser(
      logId,
      userId,
    );
    if (!log || log.isCompleted) {
      throw new ServiceError(ExceptionCode.NoOngoingQuest);
    }

    const isSucceeded: boolean =
      dayjs().isBefore(
        dayjs(log.createdAt).add(
          log.quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      ) && log.quest.answer === answer.map((e) => e.trim()).join(',');

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

    return isSucceeded;
  }
}
