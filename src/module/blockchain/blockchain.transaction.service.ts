import { Inject, Injectable } from '@nestjs/common';
import { ethers, InterfaceAbi } from 'ethers';
import 'dotenv/config';

import { TransactionRepositoryService } from '../repository/service/transaction.repository.service';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { BlockchainCoreService } from './blockchain.core.service';
import { NULL_ADDRESS, TopicToAbi } from './dto/blockchain.dto';
import { EventTopicName } from '../repository/enum/transaction.enum';

@Injectable()
export class BlockchainTransactionService {
  constructor(
    @Inject(TransactionRepositoryService)
    private readonly txnRepositoryService: TransactionRepositoryService,

    @Inject(BlockchainCoreService)
    private readonly coreService: BlockchainCoreService,
  ) {}

  decodeLogData(log: ethers.Log, abi: InterfaceAbi): ethers.LogDescription {
    const iface = new ethers.Interface(abi);
    const decodedLog = iface.parseLog(log);

    return decodedLog;
  }

  async upsertTransactionLogs(logs: Partial<LogTransactionEntity>[]) {
    await this.txnRepositoryService.upsertLogs(logs);
  }

  async findLastSyncedBlock(): Promise<number> {
    const blockNumber =
      await this.txnRepositoryService.findLatestSyncedBlockNumber();

    return blockNumber;
  }

  async processLog(
    collectedLogs: ethers.Log[],
  ): Promise<Partial<LogTransactionEntity>[]> {
    const rowsToInsert: Partial<LogTransactionEntity>[] = [];
    let blockNumberToTimestamp: { [blockNumber: number]: number } = {};
    for (let log of collectedLogs) {
      const {
        blockNumber,
        blockHash,
        transactionHash,
        address,
        transactionIndex,
      } = log;
      if (!(blockNumber in blockNumberToTimestamp)) {
        const block = await this.coreService.getBlockByNumber(blockNumber);

        blockNumberToTimestamp[blockNumber] = block.timestamp;
      }
      const decodedLog = this.decodeLogData(log, TopicToAbi.mint);
      const [to, tokenId] = decodedLog.args;

      rowsToInsert.push({
        contractAddress: ethers.getAddress(address),
        blockHash,
        blockNumber,
        from: NULL_ADDRESS,
        to: ethers.getAddress(to),
        tokenId: parseInt(tokenId),
        topic: EventTopicName.Mint,
        timestamp: blockNumberToTimestamp[blockNumber],
        transactionHash,
        transactionIndex,
      });
    }

    return rowsToInsert;
  }
}
