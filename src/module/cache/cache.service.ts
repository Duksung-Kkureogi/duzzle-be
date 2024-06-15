import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from 'src/module/config/config.service';

@Injectable()
export class CacheService {
  private memory: Redis;

  constructor(private readonly configService: ConfigService) {
    this.memory = new Redis(this.configService.get<string>('REDIS_PATH'));
  }

  /**
   * @param ttl 밀리초
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.memory.set(key, value, 'PX', ttl);
    } else {
      await this.memory.set(key, value);
    }
  }

  async find(key: string): Promise<string> {
    return await this.memory.get(key);
  }

  async remove(key: string): Promise<void> {
    await this.memory.del(key);
  }
}
