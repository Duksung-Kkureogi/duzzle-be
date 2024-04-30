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

  // In-momory DB
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_TTL: {
    EDIT_NAME: number;
  };
}
