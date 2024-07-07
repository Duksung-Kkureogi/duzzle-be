import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '../package.json';
import { AuthorizationToken } from './constant/authorization-token';
import { ExceptionCode } from './constant/exception';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setDescription(
      `\n\
      API 공통\n\n\n\
        * 잘못된 요청 파라미터 - 400 Bad Request\n\
        {\n\
          "code": ${ExceptionCode.InvalidParameter},\n\
          "message": "",\n\
        }\n\n\
        * 서버 에러 - 500 Internal Server Error \n\
        {\n\
          "code": ${ExceptionCode.InternalServerError},\n\
          "message": "",\n\
        }\n\
        `,
    )
    .addBearerAuth(
      {
        name: 'Authorization',
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'User Authorization Token',
      },
      AuthorizationToken.BearerUserToken,
    )
    .addBearerAuth(
      {
        name: 'Authorization',
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Web3Auth Id Token',
      },
      AuthorizationToken.BearerLoginIdToken,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
