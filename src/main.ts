import { NestFactory } from '@nestjs/core';
import { MainModule } from './module/main.module';
import { Logger, RequestMethod, VersioningType } from '@nestjs/common';
import { ConfigService } from './module/config/config.service';
import { IncomingMessage, ServerResponse } from 'http';
import morganBody from 'morgan-body';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(),
    {
      cors: true,
    },
  );
  // useContainer(app.select(MainModule), { fallbackOnErrors: true });
  const isProduction = ConfigService.isProduction();
  const port = ConfigService.getConfig().PORT;

  app.setGlobalPrefix(ConfigService.getConfig().API_VERSION, {
    exclude: [
      { path: '/health', method: RequestMethod.GET },
      { path: '/maintenance', method: RequestMethod.GET },
      { path: '/version', method: RequestMethod.GET },
    ],
  });
  app.setGlobalPrefix(ConfigService.getConfig().API_VERSION, {
    exclude: [
      { path: '/health', method: RequestMethod.GET },
      { path: '/maintenance', method: RequestMethod.GET },
      { path: '/version', method: RequestMethod.GET },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(json({ limit: ConfigService.getConfig().HTTP_BODY_SIZE_LIMIT }));

  app.use(
    urlencoded({
      extended: true,
      limit: ConfigService.getConfig().HTTP_URL_LIMIT,
    }),
  );

  // morganBody(app.getHttpAdapter().getInstance(), {
  //   noColors: true,
  //   prettify: false,
  //   includeNewLine: false,
  //   skip(_req: IncomingMessage, res: ServerResponse) {
  //     if (_req.url === '/health') {
  //       return true;
  //     }
  //     return isProduction ? res.statusCode < 400 : false;
  //   },
  //   stream: {
  //     write: (message: string) => {
  //       Logger.log(message.replace('\n', ''), 'Http');
  //       return true;
  //     },
  //   },
  // });
  // const reflector = app.get(Reflector);

  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(reflector),
  // );

  app.enableShutdownHooks();

  await app.listen(port);

  Logger.log(
    `Server ${ConfigService.getConfig().ENV} running on port ${port}`,
    'APP',
  );
}
bootstrap();
