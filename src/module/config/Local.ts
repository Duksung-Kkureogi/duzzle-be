import { Configuration, SupportedEnvironment } from './Configuration';

const config: Configuration = {
  // STAGE Environment
  ENV: SupportedEnvironment.local,

  // SERVICE PORT
  PORT: 8000,
  API_VERSION: 'v1',
  HTTP_BODY_SIZE_LIMIT: '1mb',
  HTTP_URL_LIMIT: '1mb',

  // DB
  DB_INFO: {
    host: 'localhost',
    port: 5432,
    max: 50,
    database: 'duzzle',
    user: 'local',
    password: '1q2w3e',
  },
  USE_SYNCHRONIZE: true,

  // JWT
  JWT_SECRET: 'ns0s9xcuv0=^alg0xtrtw7o=we9k_#ko%q*tx@an3z-x-3b@u=',
  JWT_ACCESS_EXPIRES_IN: '30m',
  JWT_REFRESH_EXPIRES_IN: '30d',
  WEB3AUTH_JWKS_ENDPOINT: {
    SOCIAL_LOGIN: 'https://api-auth.web3auth.io/jwks',
    EXTERNAL_WALLET: 'https://authjs.web3auth.io/jwks',
  },

  // MAILGUN
  MAILGUN_USERNAME: 'api',
  MAILGUN_KEY: 'c13873f7570bafb50f7e40bc75447fae-86220e6a-7d295da1',

  // AWS
  AWS_REGION: 'ap-northeast-2',
  AWS_S3_ACCESS_KEY: 'AKIASPFPKRIKHEFEBZGD',
  AWS_S3_SECRET_ACCESS_KEY: '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',
  AWS_S3_BUCKET_NAME: 'duzzle-s3-bucket',
};

export default config;
