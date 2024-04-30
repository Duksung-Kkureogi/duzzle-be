import { Configuration, SupportedEnvironment } from './Configuration';

const config: Configuration = {
  // STAGE Environment
  ENV: SupportedEnvironment.development,

  // SERVICE PORT
  PORT: 8080,
  API_VERSION: 'v1',
  HTTP_BODY_SIZE_LIMIT: '1mb',
  HTTP_URL_LIMIT: '1mb',

  // DB
  DB_INFO: {
    host: 'duzzle-development.croia0wi0ych.ap-northeast-2.rds.amazonaws.com',
    port: 5432,
    max: 50,
    database: 'duzzle',
    user: 'dskk',
    password: 'MyUQ6yf36FQ1sr9Pl5Yz',
  },
  USE_SYNCHRONIZE: true,

  // JWT
  JWT_SECRET: '#b1b4!1^+1w=&43^mgvb9h&ia90wq2f2)3&0c^h7pb+!i-5g%q',
  JWT_ACCESS_EXPIRES_IN: '30m',
  JWT_REFRESH_EXPIRES_IN: '30d',
  WEB3AUTH_JWKS_ENDPOINT: {
    SOCIAL_LOGIN: 'https://api-auth.web3auth.io/jwks',
    EXTERNAL_WALLET: 'https://authjs.web3auth.io/jwks',
  },

  // In-momory DB
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
};

export default config;
