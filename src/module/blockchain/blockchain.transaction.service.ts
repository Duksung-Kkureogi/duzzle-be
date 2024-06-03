import { Inject, Injectable } from '@nestjs/common';
import { ethers, InterfaceAbi } from 'ethers';
import 'dotenv/config';

import { TransactionRepositoryService } from '../repository/service/transaction.repository.service';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { BlockchainCoreService } from './blockchain.core.service';
import { NULL_ADDRESS, TopicToAbi } from './dto/blockchain.dto';
import { EventTopicName } from '../repository/enum/transaction.enum';
import { ContractKey, ContractType } from '../repository/enum/contract.enum';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ItemRepositoryService } from '../repository/service/item.repository.service';
import { PuzzleRepositoryService } from './../repository/service/puzzle.repository.service';

@Injectable()
export class BlockchainTransactionService {
  constructor(
    @Inject(TransactionRepositoryService)
    private readonly txnRepositoryService: TransactionRepositoryService,

    @Inject(NftRepositoryService)
    private readonly nftRepositoryService: NftRepositoryService,

    @Inject(ItemRepositoryService)
    private readonly itemRepositoryService: ItemRepositoryService,

    @Inject(PuzzleRepositoryService)
    private readonly puzzleRepositoryService: PuzzleRepositoryService,

    @Inject(BlockchainCoreService)
    private readonly coreService: BlockchainCoreService,
  ) {}

  async getAllTxLogs() {
    return await this.txnRepositoryService.getAllLogs();
  }

  async syncAllNftOwnersOfLogs(logs: Partial<LogTransactionEntity>[]) {
    const nftContracts = await this.nftRepositoryService.findContractsByType(
      ContractType.ERC721,
    );

    let puzzlePieceMintedLogs: Partial<LogTransactionEntity>[] = [];
    let blueprintMintedLogs: Partial<LogTransactionEntity>[] = [];
    let materialMintedLogs: Partial<LogTransactionEntity>[] = [];

    logs.forEach((log) => {
      let contractKey = nftContracts.find(
        (e) => e.address === log.contractAddress,
      ).key;
      switch (contractKey) {
        case ContractKey.PUZZLE_PIECE:
          puzzlePieceMintedLogs.push(log);
          break;
        case ContractKey.ITEM_BLUEPRINT:
          blueprintMintedLogs.push(log);
          break;
        case ContractKey.ITEM_MATERIAL:
          materialMintedLogs.push(log);
      }
    });

    await Promise.all([
      ...puzzlePieceMintedLogs.map((e) =>
        this.puzzleRepositoryService.updateOwner(
          e.tokenId,
          ethers.getAddress(e.to),
        ),
      ),
      ...blueprintMintedLogs.map((e) => {
        this.itemRepositoryService.updateBlueprintOwner(
          e.tokenId,
          ethers.getAddress(e.to),
        );
      }),
      ...materialMintedLogs.map((e) => {
        this.itemRepositoryService.upsertMaterialOnwer(
          e.tokenId,
          ethers.getAddress(e.to),
          e.contractAddress,
        );
      }),
    ]);
  }

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
