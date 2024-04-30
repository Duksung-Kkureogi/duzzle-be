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

  // In-momory DB
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  REDIS_TTL: {
    EDIT_NAME: 3 * 60 * 1000, // 3분
  },
};

export default config;
