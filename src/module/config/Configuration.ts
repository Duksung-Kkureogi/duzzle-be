import path from 'path';

export enum SupportedEnvironment {
  local = 'local',
  development = 'dev',
  production = 'prod',
}

export interface Configuration {
  // STAGE Environment
  readonly ENV: SupportedEnvironment;

  // API SERVICE VARIABLE
  readonly PORT: number;
  readonly API_VERSION: string;
  readonly HTTP_BODY_SIZE_LIMIT: string;
  readonly HTTP_URL_LIMIT: string;

  // DB
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_MAX: number;
  readonly DB_NAME: string;
  readonly DB_USER: string;
  readonly DB_PASSWORD: string;
  readonly DB_USE_SYNCHRONIZE: boolean;

  // JWT
  readonly JWT_SECRET: string;
  readonly JWT_ACCESS_EXPIRES_IN: string;
  readonly JWT_REFRESH_EXPIRES_IN: string;
  readonly WEB3AUTH_JWKS_ENDPOINT_SOCIAL_LOGIN: string;
  readonly WEB3AUTH_JWKS_ENDPOINT_EXTERNAL_WALLET: string;

  // MAILGUN
  readonly MAILGUN_USERNAME: string;
  readonly MAILGUN_KEY: string;

  // RPC URL
  readonly RPC_URL_POLYGON: string;

  readonly CONTRACT_ADDRESS_PLAY_DUZZLE: string;
  readonly CONTRACT_ADDRESS_DAL: string;
  readonly CONTRACT_ADDRESS_BLUEPRINT: string;
  readonly CONTRACT_ADDRESS_PUZZLE_PIECE: string;

  // In-momory DB
  readonly REDIS_HOST: string;
  readonly REDIS_PORT: number;
  readonly REDIS_PASSWORD: string;

  // AWS
  readonly AWS_REGION: string;
  readonly AWS_S3_ACCESS_KEY: string;
  readonly AWS_S3_SECRET_ACCESS_KEY: string;
  readonly AWS_S3_BUCKET_NAME: string;
  readonly OWNER_PK_AMOY: string;
}

export const getEnvFilePath = (): string =>
  path.join(
    process.cwd(),
    `/env/.env.${process.env.NODE_ENV ?? SupportedEnvironment.development}`,
  );

export type EnvironmentKey = keyof Configuration;
