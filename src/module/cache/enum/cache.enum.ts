export enum RedisKey {
  EditUserName = 'edit_username',
  transactionCollectionInProgress = 'tx_collection_in_progress',
  LastSyncedBlock = 'last_synced_block',
  AcidRainScore = 'quest:acidrain:score',
}

export enum RedisTTL {
  EditUserName = 10 * 60 * 1000,
}
