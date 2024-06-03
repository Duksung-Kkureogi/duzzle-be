import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';

import { BlockchainCoreService } from '../blockchain/blockchain.core.service';
import { BlockchainTransactionService } from '../blockchain/blockchain.transaction.service';
import { NftRepositoryService } from './../repository/service/nft.repository.service';
import { CacheService } from '../cache/cache.service';
import { RedisKey } from '../cache/enum/cache.enum';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { CollectRangeDto, EventTopic } from '../blockchain/dto/blockchain.dto';
import { ContractKey, ContractType } from '../repository/enum/contract.enum';
import { PuzzleRepositoryService } from '../repository/service/puzzle.repository.service';

@Injectable()
export class SchedulerService {
  private readonly MAX_BLOCK_RANGE = 2_000;

  constructor(
    @Inject(BlockchainCoreService)
    private readonly blockchainCoreService: BlockchainCoreService,

    @Inject(BlockchainTransactionService)
    private readonly blockchainTransactionService: BlockchainTransactionService,

    @Inject(NftRepositoryService)
    private readonly nftRepositoryService: NftRepositoryService,

    @Inject(PuzzleRepositoryService)
    private readonly puzzleRepositoryService: PuzzleRepositoryService,

    @Inject(CacheService)
    private readonly memory: CacheService,
  ) {}

  // TODO: 우선 Mint Transaction 만 수집
  // @Cron(CronExpression.EVERY_MINUTE, {
  //   timeZone: 'UTC',
  // })
  async collectBlockchainTransaction() {
    try {
      // 블록체인 네트워크의 최신 블록 가져오기
      const latestBlock =
        await this.blockchainCoreService.getLatestBlockNumberHex();

      // 마지막으로 수집된 블록넘버 가져오기
      let lastSyncedBlock: number = parseInt(
        await this.memory.find(RedisKey.LastSyncedBlock),
      );

      if (!lastSyncedBlock) {
        const _lastSyncedBlock =
          await this.blockchainTransactionService.findLastSyncedBlock();
        if (!_lastSyncedBlock) {
          const birthBlockOfContract = (
            await this.nftRepositoryService.findContractByKey(
              ContractKey.PLAY_DUZZLE,
            )
          ).birthBlock;
          lastSyncedBlock = birthBlockOfContract;
        }
      }

      const blockRange = parseInt(latestBlock, 16) - lastSyncedBlock;
      if (blockRange < 1) {
        return;
      }

      let collectedLogs: ethers.Log[];
      const nftContracts = await this.nftRepositoryService.findContractsByType(
        ContractType.ERC721,
      );

      const nftContractAddresses = nftContracts.map((e) => e.address);
      if (blockRange > this.MAX_BLOCK_RANGE) {
        let collectLogDtos: CollectRangeDto[] = [];
        for (
          let i = 0;
          i < Math.floor(blockRange / this.MAX_BLOCK_RANGE);
          i++
        ) {
          collectLogDtos.push({
            contractAddress: nftContractAddresses,
            fromBlock: lastSyncedBlock + this.MAX_BLOCK_RANGE * i,
            toBlock: lastSyncedBlock + this.MAX_BLOCK_RANGE * (i + 1) - 1,
            topics: [EventTopic.mint],
          });
        }
        collectedLogs = (
          await Promise.all(
            collectLogDtos.map((dto) =>
              this.blockchainCoreService.getLogs(dto),
            ),
          )
        ).flat();
      } else {
        collectedLogs = await this.blockchainCoreService.getLogs({
          contractAddress: nftContractAddresses,
          fromBlock: lastSyncedBlock,
          toBlock: parseInt(latestBlock, 16),
          topics: [EventTopic.mint],
        });
      }
      if (collectedLogs.length < 1) {
        return;
      }

      const rowsToUpsert: Partial<LogTransactionEntity>[] =
        await this.blockchainTransactionService.processLog(collectedLogs);
      const puzzlePieceMintedLogs = rowsToUpsert.filter(
        (log) =>
          log.contractAddress ===
          nftContracts.find(
            (contract) => contract.key === ContractKey.PUZZLE_PIECE,
          ).address,
      );

      Promise.all([
        ...puzzlePieceMintedLogs.map((e) =>
          this.puzzleRepositoryService.updateOwner(e.tokenId, e.to),
        ),
        this.blockchainTransactionService.upsertTransactionLogs(rowsToUpsert),
      ]),
        await this.memory.set(RedisKey.LastSyncedBlock, latestBlock);
    } catch (error) {
      Logger.error(error.stack);
      Logger.error(error);
    }
  }
}
