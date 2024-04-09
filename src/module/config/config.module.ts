import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class EnvironmentModule {}
