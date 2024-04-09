import { Configuration, SupportedEnvironment } from './Configuration';

const config: Configuration = {
  // STAGE Environment
  ENV: SupportedEnvironment.production,

  // SERVICE PORT
  PORT: 8080,
  API_VERSION: 'v1',
  HTTP_BODY_SIZE_LIMIT: '1mb',
  HTTP_URL_LIMIT: '1mb',

  // DB
  DB_INFO: {
    host: 'duzzle.croia0wi0ych.ap-northeast-2.rds.amazonaws.com',
    port: 5432,
    max: 50,
    database: 'duzzle',
    user: 'dskk',
    password: 'MyUQ6yf36FQ1sr9Pl5Yz',
  },
  USE_SYNCHRONIZE: false,

  // JWT
  JWT_SECRET: '8rom80$znw#_7swf)p!byclcem*h(+@@dm(_uq5s04s!&1453d',
  JWT_ACCESS_EXPIRES_IN: '30m',
  JWT_REFRESH_EXPIRES_IN: '30d',
};

export default config;
