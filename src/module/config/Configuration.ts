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
  readonly DB_INFO: {
    host: string;
    port: number;
    max: number;
    database: string;
    user: string;
    password: string;
  };
  readonly USE_SYNCHRONIZE: boolean;

  // JWT
  readonly JWT_SECRET: string;
  readonly JWT_ACCESS_EXPIRES_IN: string;
  readonly JWT_REFRESH_EXPIRES_IN: string;
  readonly WEB3AUTH_JWKS_ENDPOINT: {
    SOCIAL_LOGIN: string;
    EXTERNAL_WALLET: string;
  };

  // MAILGUN
  readonly MAILGUN_USERNAME: string;
  readonly MAILGUN_KEY: string;

  // RPC URL
  readonly RPC_URL: {
    POLYGON: string;
  };

  readonly CONTRACT_ADDRESS: {
    PLAY_DUZZLE: string;
    DAL: string;
    BLUEPRINT: string;
    PUZZLE_PIECE: string;
  };

  // AWS
  readonly AWS_REGION: string;
  readonly AWS_S3_ACCESS_KEY: string;
  readonly AWS_S3_SECRET_ACCESS_KEY: string;
  readonly AWS_S3_BUCKET_NAME: string;
  // In-momory DB
  REDIS_HOST: string;
  REDIS_PORT: number;
}
