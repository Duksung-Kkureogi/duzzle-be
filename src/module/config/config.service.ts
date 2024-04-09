import { Injectable } from '@nestjs/common';
import { Configuration, SupportedEnvironment } from './Configuration';
import Local from './Local';
import Development from './Development';
import Production from './Production';

@Injectable()
export class ConfigService {
  private static config: Configuration;

  public static getConfig(): Configuration {
    if (!this.config) {
      switch (process.env.NODE_ENV) {
        case SupportedEnvironment.local:
          this.config = Local;
          break;
        case SupportedEnvironment.development:
          this.config = Development;
          break;
        case SupportedEnvironment.production:
          this.config = Production;
          break;
        default:
          this.config = Development;
      }
    }

    return this.config;
  }

  public static isProduction(): boolean {
    return ConfigService.getConfig().ENV === SupportedEnvironment.production;
  }
}
