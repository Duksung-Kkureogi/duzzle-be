import { Module } from '@nestjs/common';
import { MailgunModule } from 'nestjs-mailgun';
import { MailService } from './email.service';
import { MailController } from './email.controller';

@Module({
  imports: [
    MailgunModule.forRoot({
      username: 'api',
      key: 'c13873f7570bafb50f7e40bc75447fae-86220e6a-7d295da1',
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
