import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull } from 'typeorm';

import { QuestEntity } from '../entity/quest.entity';
import { LogQuestEntity } from '../entity/log-quest.entity';
import { QuestType } from '../enum/quest.enum';

@Injectable()
export class QuestRepositoryService {
  constructor(
    @InjectRepository(QuestEntity)
    private questRepository: Repository<QuestEntity>,

    @InjectRepository(LogQuestEntity)
    private logRepository: Repository<LogQuestEntity>,
  ) {}

  async findQuestById(id: number): Promise<QuestEntity> {
    const quest = await this.questRepository.findOneBy({ id });

    return quest;
  }

  async findQuests(excludes?: number[]): Promise<QuestEntity[]> {
    if (excludes?.every((e) => !!e)) {
      return this.questRepository.findBy({ id: Not(In(excludes)) });
    }

    return this.questRepository.find();
  }

  async findRewardReceivedLogsByUserId(
    userId: number,
  ): Promise<LogQuestEntity[]> {
    const result = await this.logRepository.find({
      where: {
        userId,
        rewardReceived: true,
      },
      relations: { quest: true },
    });

    return result;
  }

  async findNotCompletedLogsByUser(userId: number): Promise<LogQuestEntity[]> {
    const logs = await this.logRepository.find({
      where: {
        userId,
        isCompleted: IsNull(),
      },
      relations: {
        quest: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return logs;
  }

  async findNotCompletedLogs(
    userId: number,
    questId: number,
  ): Promise<LogQuestEntity[]> {
    const logs = await this.logRepository.find({
      where: {
        userId,
        questId,
        isCompleted: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        quest: true,
      },
    });
    return logs;
  }

  async insertLog(log: Partial<LogQuestEntity>): Promise<LogQuestEntity> {
    const logEntity = this.logRepository.create(log);
    await this.logRepository.save(logEntity);

    return logEntity;
  }

  async updateLog(log: LogQuestEntity): Promise<void> {
    await this.logRepository.update(log.id, log);
  }

  async findLogsByUser(userId: number): Promise<LogQuestEntity[]> {
    const log = await this.logRepository.find({
      where: { userId },
      relations: { quest: true, user: true },
      order: { createdAt: 'DESC' },
    });

    return log;
  }

  async findLogByIdAndUser(
    id: number,
    userId: number,
  ): Promise<LogQuestEntity> {
    const log = await this.logRepository.findOne({
      where: { id, userId },
      relations: { quest: true, user: true },
    });

    return log;
  }

  async findGuestLogById(id: number): Promise<LogQuestEntity> {
    const log = await this.logRepository.findOne({
      where: { id, isGuestUser: true },
      relations: { quest: true },
    });

    return log;
  }
}
