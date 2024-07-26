import { ConfigService } from '../config/config.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';

import { BlockchainCoreService } from '../blockchain/blockchain.core.service';
import { BlockchainTransactionService } from '../blockchain/blockchain.transaction.service';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { CacheService } from '../cache/cache.service';
import { RedisKey } from '../cache/enum/cache.enum';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { CollectRangeDto, EventTopic } from '../blockchain/dto/blockchain.dto';
import { ContractKey, ContractType } from '../repository/enum/contract.enum';

@Injectable()
export class TransactionCollectionScheduler {
  private readonly MAX_BLOCK_RANGE = 2_000;
  private readonly MAX_REQUESTS_PER_SECOND = 10;

  constructor(
    @Inject(BlockchainCoreService)
    private readonly blockchainCoreService: BlockchainCoreService,

    @Inject(BlockchainTransactionService)
    private readonly blockchainTransactionService: BlockchainTransactionService,

    @Inject(NftRepositoryService)
    private readonly nftRepositoryService: NftRepositoryService,

    @Inject(CacheService)
    private readonly memory: CacheService,

    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    timeZone: 'UTC',
  })
  async collectBlockchainTransaction() {
    const isLocal = this.configService.isLocal();
    if (isLocal) {
      return;
    }

    if (await this.isSchedulerRunning()) {
      console.log('Scheduler is already running');
      return;
    }

    await this.setStartFlag();

    // 블록체인 네트워크의 최신 블록 가져오기
    const latestBlock =
      await this.blockchainCoreService.getLatestBlockNumberHex();
    console.log('latestBlock: ', latestBlock);

    console.time('collectBlockchainTransaction');
    try {
      // 마지막으로 수집된 블록넘버 가져오기
      const lastSyncedBlock: number = await this.getLastSyncedBlock();
      console.log(lastSyncedBlock);

      const blockRange = parseInt(latestBlock, 16) - lastSyncedBlock;
      if (blockRange < 1) {
        return;
      }
      console.log('blockRange: ', blockRange);

      let collectedLogs: ethers.Log[] = [];
      const nftContracts = await this.nftRepositoryService.findContractsByType(
        ContractType.ERC721,
      );

      const nftContractAddresses = nftContracts.map((e) => e.address);
      if (blockRange > this.MAX_BLOCK_RANGE) {
        let collectLogDtos: CollectRangeDto[] = [];
        for (
          let i = 0;
          i < Math.floor(blockRange / this.MAX_BLOCK_RANGE) + 1;
          i++
        ) {
          collectLogDtos.push({
            contractAddress: nftContractAddresses,
            fromBlock: lastSyncedBlock + this.MAX_BLOCK_RANGE * i,
            toBlock: lastSyncedBlock + this.MAX_BLOCK_RANGE * (i + 1) - 1,
            topics: [EventTopic.transfer],
          });
        }

        console.log('collectLogDto length: ', collectLogDtos.length);
        // Alchemy API 요청 제한을 고려하여 요청을 분할하여 처리
        if (collectLogDtos.length < this.MAX_REQUESTS_PER_SECOND) {
          collectedLogs = (
            await Promise.all(
              collectLogDtos.map((e) => this.blockchainCoreService.getLogs(e)),
            )
          ).flat();
        } else {
          for (let i: number = 0; i < collectLogDtos.length; i++) {
            let logs: ethers.Log[] = await this.blockchainCoreService.getLogs(
              collectLogDtos[i],
            );

            collectedLogs = [...collectedLogs, ...logs];
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      } else {
        collectedLogs = await this.blockchainCoreService.getLogs({
          contractAddress: nftContractAddresses,
          fromBlock: lastSyncedBlock,
          toBlock: parseInt(latestBlock, 16),
          topics: [EventTopic.transfer],
        });
      }
      if (collectedLogs.length < 1) {
        return;
      }

      const txLogsToUpsert: Partial<LogTransactionEntity>[] =
        await this.blockchainTransactionService.processLog(collectedLogs);

      await Promise.all([
        this.blockchainTransactionService.syncAllNftOwnersOfLogs(
          txLogsToUpsert,
        ),
        this.blockchainTransactionService.upsertTransactionLogs(txLogsToUpsert),
      ]);
    } catch (error) {
      Logger.error(error.stack);
      Logger.error(error);
    } finally {
      await this.setEndFlag();
      console.timeEnd('collectBlockchainTransaction');
    }
  }

  private async isSchedulerRunning() {
    return this.memory.find(RedisKey.transactionCollectionInProgress);
  }

  private async setStartFlag() {
    await this.memory.set(RedisKey.transactionCollectionInProgress, 'true');
  }

  private async setEndFlag() {
    await this.memory.remove(RedisKey.transactionCollectionInProgress);
  }

  private async getLastSyncedBlock() {
    // 마지막으로 수집된 블록넘버 가져오기
    let lastSyncedBlock =
      await this.blockchainTransactionService.findLastSyncedBlock();
    if (!lastSyncedBlock) {
      const birthBlockOfContract = (
        await this.nftRepositoryService.findContractByKey(
          ContractKey.PLAY_DUZZLE,
        )
      ).birthBlock;
      lastSyncedBlock = birthBlockOfContract;
    } else {
      return lastSyncedBlock;
    }
  }
}
