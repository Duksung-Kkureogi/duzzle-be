export enum RedisKey {
  EditUserName = 'edit_username',
  LastSyncedBlock = 'last_synced_block',
}

export enum RedisTTL {
  EditUserName = 10 * 60 * 1000,
}
