import { NestFactory } from '@nestjs/core';
import { MainModule } from './module/main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { cors: true });
  await app.listen(3000);
}
bootstrap();
