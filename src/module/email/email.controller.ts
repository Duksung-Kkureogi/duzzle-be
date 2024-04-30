import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { MailService } from './email.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailgunMessageData } from 'nestjs-mailgun';
import { SendMailRequest } from './dto/email.dto';

@Controller({
  path: 'email',
})
export class MailController {
  constructor(
    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}

  @ApiTags('Mail')
  @ApiOperation({ summary: '가입 환영 메일 발송' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Post('mail')
  async sendWelcomeMail(
    @Body() dto: SendMailRequest,
  ) {
    const option: MailgunMessageData = {
      to: dto.email,
      template: 'welcometemplate',
      'h:X-Mailgun-Variables': `{"email":"${dto.email}"}`,
    };

    await this.mailService.sendMail(option);
  }
}
