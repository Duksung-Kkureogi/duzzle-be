import { NFTAsset } from 'src/module/nft-exchange/dto/nft-asset';

export class NftExchangeOfferDto {
  offerorUserId: number;
  offeredNfts: NFTAsset[];
  requestedNfts: NFTAsset[];
}
