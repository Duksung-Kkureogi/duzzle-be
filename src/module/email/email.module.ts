import { Global, Module } from '@nestjs/common';
import { MailgunModule } from 'nestjs-mailgun';
import { MailService } from './email.service';
import { MailController } from './email.controller';
import { ConfigService } from '../config/config.service';
@Module({
  imports: [
    MailgunModule.forRoot({
      username: ConfigService.getConfig().MAILGUN_USERNAME,
      key: ConfigService.getConfig().MAILGUN_KEY,
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
