import {
  BlueprintOrPuzzleNFT,
  MaterialNFT,
  NFTAsset,
  NFTType,
} from './dto/nft-asset';

export const isMaterialNFT = (nft: NFTAsset): nft is MaterialNFT => {
  return nft.type === NFTType.Material;
};

export const isBlueprintOrPuzzleNFT = (
  nft: NFTAsset,
): nft is BlueprintOrPuzzleNFT => {
  return nft.type === NFTType.Blueprint || nft.type === NFTType.PuzzlePiece;
};
