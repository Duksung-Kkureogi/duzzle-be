import { Injectable } from '@nestjs/common';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { QuestRepositoryService } from '../repository/service/quest.repository.service';
import { StartRandomQuestResponse } from './dto/quest.dto';
import dayjs from 'dayjs';

@Injectable()
export class QuestService {
  private latency: number = 2000; // 퀘스트 응답/처리 등을 고려한 추가 시간, milliseconds
  constructor(
    private readonly questRepositoryService: QuestRepositoryService,
  ) {}

  async getRandomQuest(userId: number): Promise<StartRandomQuestResponse> {
    const logs =
      await this.questRepositoryService.findSucceededLogsByUserId(userId);

    const quest = await this.questRepositoryService.findRandomQuest(
      logs.map((e) => e.id),
    );

    if (!quest) {
      throw new ServiceError(ExceptionCode.LimitExceeded);
    }

    await this.questRepositoryService.insertLog(userId, quest.id);

    return StartRandomQuestResponse.from(quest);
  }

  async isAlreadyOngoing(userId: number) {
    const logs =
      await this.questRepositoryService.findNotCompletedLogsByUser(userId);
    if (logs.length) {
      const isTimedOut = dayjs().isAfter(
        dayjs(logs[0].createdAt).add(
          logs[0].quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      );

      return isTimedOut;
    }

    return false;
  }

  async getResult(
    userId: number,
    questId: number,
    answer: string[],
  ): Promise<boolean> {
    const logs = await this.questRepositoryService.findNotCompletedLogs(
      userId,
      questId,
    );

    if (!!!logs.length) {
      throw new ServiceError(ExceptionCode.NoOngoingQuest);
    }

    const latestQuest = logs[0];

    const isSucceeded: boolean =
      dayjs().isBefore(
        dayjs(latestQuest.createdAt).add(
          latestQuest.quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      ) && latestQuest.quest.answer === answer.map((e) => e.trim()).join(',');

    latestQuest.isCompleted = true;
    latestQuest.isSucceeded = isSucceeded;

    await this.questRepositoryService.updateLog(latestQuest);

    return isSucceeded;
  }
}
