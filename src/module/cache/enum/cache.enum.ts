export enum RedisKey {
  EditUserName = 'edit_username',
  transactionCollectionInProgress = 'tx_collection_in_progress',
  AcidRainScore = 'quest:acidrain:score',
  DuksaeJumpScore = 'quest:duksaejump:score',
  burnedNFTsQueue = 'burned_nfts_queue',
}

export enum RedisTTL {
  EditUserName = 10 * 60 * 1000,
}
