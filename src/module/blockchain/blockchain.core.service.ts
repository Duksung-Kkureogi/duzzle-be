import { HttpClientService } from './../http-client/http-client.service';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { Inject, Injectable } from '@nestjs/common';
import { Contract, ethers, Filter, toBeHex } from 'ethers';
import 'dotenv/config';

import { abi as DalAbi } from './abi/Dal.json';
import { ConfigService } from '../config/config.service';
import { Dal } from './typechain/contracts/erc-20';
import {
  CollectRangeDto,
  EVMApiMethod,
  GetBlockResponse,
  JsonRpcSupportedVersion,
  MostRecentBlock,
} from './dto/blockchain.dto';
import { ContractKey } from '../repository/enum/contract.enum';
import { RPCProvider } from '../scheduler/constants/rpc-provider';

@Injectable()
export class BlockchainCoreService {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly providersForCollectingTxLogs: ethers.JsonRpcProvider[] = [];

  private readonly signer: ethers.Wallet;
  private readonly rpcUrl: string;
  private readonly rpcsUrlForCollectingTxLogs: string[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly nftRepositoryService: NftRepositoryService,
    @Inject(HttpClientService)
    private readonly http: HttpClientService,
  ) {
    this.rpcUrl = this.configService.get<string>(
      'BLOCKCHAIN_POLYGON_RPC_ENDPOINT',
    );
    this.rpcsUrlForCollectingTxLogs = [
      this.configService.get<string>(
        'BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS',
      ),
      this.configService.get<string>(
        'BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS_2',
      ),
      this.configService.get<string>(
        'BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS_3',
      ),
      this.configService.get<string>(
        'BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS_4',
      ),
    ];

    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.providersForCollectingTxLogs = this.rpcsUrlForCollectingTxLogs.map(
      (e) => new ethers.JsonRpcProvider(e),
    );

    this.signer = new ethers.Wallet(process.env.OWNER_PK_AMOY, this.provider);
  }

  async mintDalToken(to: string, count: number): Promise<void> {
    const dalContractAddress: string = (
      await this.nftRepositoryService.findContractByKey(ContractKey.DAL)
    ).address;
    const dalContract: Dal = new Contract(
      dalContractAddress,
      DalAbi,
      this.signer,
    ) as unknown as Dal;

    await dalContract.mint(to, ethers.parseEther(String(count)));
  }

  /**
   *
   * @returns 16진수
   */
  async getLatestBlockNumberHex(): Promise<string> {
    // await this.provider.getBlockNumber(); // TODO:
    const res = await this.http.sendPostRequest<GetBlockResponse>(this.rpcUrl, {
      jsonrpc: JsonRpcSupportedVersion,
      method: EVMApiMethod.GET_BLOCK,
      params: [MostRecentBlock, false],
    });

    if (res.error) {
      throw new Error(res.error);
    }

    return res.data.result.number;
  }

  async getLogs(
    dtos: CollectRangeDto[],
    rpcProvider: RPCProvider,
  ): Promise<ethers.Log[]> {
    const filters: Filter[] = dtos.map((e) => {
      return {
        fromBlock: toBeHex(e.fromBlock),
        toBlock: toBeHex(e.toBlock),
        address: e.contractAddress,
        topics: e.topics,
      };
    });

    const logs = await Promise.all(
      filters.map((filter) =>
        this.providersForCollectingTxLogs[rpcProvider].getLogs(filter),
      ),
    );

    return logs.flat();
  }

  async getBlockByNumber(blockNumber: number): Promise<ethers.Block> {
    let block: ethers.Block;
    try {
      block = await this.provider.getBlock(blockNumber);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1.5 * 1000)); // retryDelay in seconds
      block = await this.provider.getBlock(blockNumber);
    }

    return block;
  }
}
