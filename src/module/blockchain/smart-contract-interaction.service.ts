import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import { abi as DalAbi } from './abi/Dal.json';
import { ConfigService } from '../config/config.service';
import { Dal } from './typechain/contracts/erc-20';

@Injectable()
export class SmartContractInteractionService {
  private provider: ethers.JsonRpcProvider;
  private readonly signer: ethers.Wallet;

  constructor(
    private configService: ConfigService,
    private readonly nftRepositoryService: NftRepositoryService,
  ) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('BLOCKCHAIN_POLYGON_RPC_ENDPOINT'),
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
}
