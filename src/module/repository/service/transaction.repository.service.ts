import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionLogEntity } from '../entity/transaction-log.entity';

@Injectable()
export class TransactionRepositoryService {
  constructor(
    @InjectRepository(TransactionLogEntity)
    private txLogRepository: Repository<TransactionLogEntity>,
  ) {}

  async insertLogs(entities: Partial<TransactionLogEntity>[]) {
    await this.txLogRepository.insert(entities);
  }

  async findLatestSyncedBlockNumber(): Promise<number | null> {
    const blockNumber = await this.txLogRepository.maximum('blockNumber');

    return blockNumber;
  }
}
