import { Injectable } from '@nestjs/common';
import { ContractFactory, ethers } from 'ethers';
import {
  abi as PlayDuzzleAbi,
  bytecode as PlayDuzzleByteCode,
} from './abi/PlayDuzzle.json';
import 'dotenv/config';

import { abi as DalAbi, bytecode as DalByteCode } from './abi/Dal.json';
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
    this.dalContract = new ContractFactory(DalAbi, DalByteCode, signer).attach(
      ConfigService.getConfig().CONTRACT_ADDRESS.DAL,
    );

    this.playDuzzleContract = new ContractFactory(
      PlayDuzzleAbi,
      PlayDuzzleByteCode,
      signer,
    ).attach(ConfigService.getConfig().CONTRACT_ADDRESS.PLAY_DUZZLE);
  }

  async mintDalToken(to: string, amount: number) {
    await this.dalContract.mint(to, ethers.parseEther(String(amount)));
  }
}
