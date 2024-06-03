import { Controller, Inject, Post } from '@nestjs/common';
import { BlockchainTransactionService } from './blockchain.transaction.service';

@Controller()
export class BlockchainController {
  constructor(
    @Inject(BlockchainTransactionService)
    private readonly txService: BlockchainTransactionService,
  ) {}

  @Post('retry-data-sync')
  async retryDataSync(): Promise<string> {
    const allLogs = await this.txService.getAllTxLogs();
    await this.txService.syncAllNftOwnersOfLogs(allLogs);

    return 'OK';
  }
}
