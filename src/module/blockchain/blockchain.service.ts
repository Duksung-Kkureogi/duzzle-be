import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { abi as PlayDuzzleAbi } from './abi/PlayDuzzle.json';
import 'dotenv/config';

import { abi as DalAbi } from './abi/Dal.json';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BlockchainService {
  readonly dalContract: any;
  readonly playDuzzleContract: any;

  constructor(private readonly configService: ConfigService) {
    const provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_URL_POLYGON'),
    );

    const signer = new ethers.Wallet(process.env.OWNER_PK_AMOY, provider);
    this.dalContract = new Contract(
      this.configService.get<string>('CONTRACT_ADDRESS_DAL'),
      DalAbi,
      signer,
    );

    this.playDuzzleContract = new Contract(
      this.configService.get<string>('CONTRACT_ADDRESS_PLAY_DUZZLE'),
      PlayDuzzleAbi,
      signer,
    );
  }

  async mintDalToken(to: string, amount: number) {
    await this.dalContract.mint(to, ethers.parseEther(String(amount)));
  }
}
