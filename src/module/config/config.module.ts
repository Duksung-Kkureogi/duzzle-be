import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { getEnvFilePath } from './Configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [getEnvFilePath()],
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class EnvironmentModule {}
