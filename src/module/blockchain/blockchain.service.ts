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

  constructor() {
    const provider = new ethers.JsonRpcProvider(
      ConfigService.getConfig().RPC_URL.POLYGON,
    );

    const signer = new ethers.Wallet(process.env.OWNER_PK_AMOY, provider);
    this.dalContract = new Contract(
      ConfigService.getConfig().CONTRACT_ADDRESS.DAL,
      DalAbi,
      signer,
    );

    this.playDuzzleContract = new Contract(
      ConfigService.getConfig().CONTRACT_ADDRESS.PLAY_DUZZLE,
      PlayDuzzleAbi,
      signer,
    );
  }

  async mintDalToken(to: string, amount: number) {
    await this.dalContract.mint(to, ethers.parseEther(String(amount)));
  }
}
