import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull } from 'typeorm';

import { QuestEntity } from '../entity/quest.entity';
import { LogQuestEntity } from '../entity/log-quest.entity';

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

  async findQuests(excludes: number[]): Promise<QuestEntity[]> {
    const quests = await this.questRepository.findBy({
      id: Not(In(excludes)),
    });

    return quests;
  }

  async findSucceededLogsByUserId(userId: number): Promise<LogQuestEntity[]> {
    const result = await this.logRepository.find({
      where: {
        userId,
        isSucceeded: true,
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

  async insertLog(userId: number, questId: number): Promise<LogQuestEntity> {
    const log = this.logRepository.create({
      userId,
      questId,
    });
    await this.logRepository.save(log);

    return log;
  }

  async updateLog(log: LogQuestEntity): Promise<void> {
    await this.logRepository.update(log.id, log);
  }

  async getLogByIdAndUser(id: number, userId: number): Promise<LogQuestEntity> {
    const log = await this.logRepository.findOne({
      where: { id, userId },
      relations: { quest: true },
    });

    return log;
  }
}
