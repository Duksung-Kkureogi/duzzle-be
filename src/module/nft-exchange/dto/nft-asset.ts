export enum NFTType {
  Material = 'material',
  Blueprint = 'blueprint',
  PuzzlePiece = 'puzzlePiece',
}

export class MaterialNFT {
  readonly type = NFTType.Material;
  contractId: number; // 컨트랙트 ID 유효성 검사 중요
  quantity: number;
}

export class BlueprintOrPuzzleNFT {
  readonly type: NFTType.Blueprint | NFTType.PuzzlePiece;
  seasonZoneId: number;
  quantity: number;
}

export type NFTAsset = MaterialNFT | BlueprintOrPuzzleNFT;
