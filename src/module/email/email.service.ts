import { Injectable } from '@nestjs/common';
import { MailgunMessageData, MailgunService } from 'nestjs-mailgun';
import { ExceptionCode } from 'src/constant/exception';
import { ServiceError } from 'src/types/exception';

@Injectable()
export class MailService {
  constructor(private mailgunService: MailgunService) {}

  async sendMail(option: MailgunMessageData) {
    try {
      await this.mailgunService.createEmail(
        'sandboxc24a5da340d24fb88c51452c411b9dcc.mailgun.org',
        option,
      );
    } catch (e) {
      throw new ServiceError(ExceptionCode.Forbidden);
    }
  }
}
