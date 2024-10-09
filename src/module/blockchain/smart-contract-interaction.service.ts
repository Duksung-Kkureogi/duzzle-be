import { Injectable } from '@nestjs/common';
import { AddressLike, BigNumberish, Contract, ethers } from 'ethers';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import { abi as DalAbi } from './abi/Dal.json';
import { ConfigService } from '../config/config.service';
import { Dal } from './typechain/contracts/erc-20';
import { NFTSwapAbi } from './abi/NFTSwap.abi';
import { NFTSwap } from './typechain/contracts/service';

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

  async nftSwap(
    nftContractsGivenByA: AddressLike[],
    tokenIdsGivenByA: BigNumberish[],
    nftContractsGivenByB: AddressLike[],
    tokenIdsGivenByB: BigNumberish[],
    userA: AddressLike,
    userB: AddressLike,
  ): Promise<{
    success: boolean;
    transactionHash: string;
    failureReason?: string;
  }> {
    const nftSwapContractAddress: string = (
      await this.nftRepositoryService.findContractByKey(ContractKey.NFT_SWAP)
    ).address;

    const nftSwapContract: NFTSwap = new ethers.Contract(
      nftSwapContractAddress,
      NFTSwapAbi,
      this.signer,
    ) as unknown as NFTSwap;

    try {
      const tx = await nftSwapContract.executeNFTSwap(
        nftContractsGivenByA,
        tokenIdsGivenByA,
        nftContractsGivenByB,
        tokenIdsGivenByB,
        userA,
        userB,
      );

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return {
          success: true,
          transactionHash: receipt.hash,
        };
      } else {
        return {
          success: false,
          transactionHash: receipt.hash,
          failureReason: 'Transaction failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        transactionHash: error.transactionHash,
        failureReason: error.message || 'Transaction failed',
      };
    }
  }
}
