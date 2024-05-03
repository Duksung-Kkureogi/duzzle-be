import { Injectable } from '@nestjs/common';
import { MailgunService } from 'nestjs-mailgun';
import { ExceptionCode } from 'src/constant/exception';
import { ServiceError } from 'src/types/exception';
import { MailTemplate } from '../repository/enum/mail.enum';

@Injectable()
export class MailService {
  constructor(
    private mailgunService: MailgunService,
    private readonly domain: string = 'sandboxc24a5da340d24fb88c51452c411b9dcc.mailgun.org',
  ) {}

  async sendMail(to: string, template: MailTemplate, mailData?: any) {
    try {
      await this.mailgunService.createEmail(this.domain, {
        to,
        template,
        'h:X-Mailgun-Variables': JSON.stringify(mailData),
      });
    } catch (e) {
      throw new ServiceError(ExceptionCode.InternalServerError, e);
    }
  }
}
