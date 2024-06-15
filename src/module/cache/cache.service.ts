import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from 'src/module/config/config.service';

@Injectable()
export class CacheService {
  private memory: Redis;

  constructor(private readonly configService: ConfigService) {
    this.memory = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      lazyConnect: true,
      connectTimeout: 3000,
      commandTimeout: 1500,
      maxRetriesPerRequest: 1,
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  /**
   * @param ttl 밀리초
   */
  async set(key: string, value: string | number, ttl?: number): Promise<void> {
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

  async incr(key: string): Promise<number> {
    return await this.memory.incr(key);
  }

  async incrBy(key: string, increment: number): Promise<number> {
    return await this.memory.incrby(key, increment);
  }

  async incrbyfloat(key: string, increment: number): Promise<number> {
    return parseFloat(await this.memory.incrbyfloat(key, increment));
  }
}
