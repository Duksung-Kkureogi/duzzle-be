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
import { WelcomeMailData } from 'src/types/mail-data';
import { SendMailRequest } from './dto/email.dto';
import { MailTemplate } from '../repository/enum/mail.enum';

@Controller({
  path: 'email',
})
export class MailController {
  constructor(
    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}

  @ApiTags('Mail')
  @ApiOperation({ summary: '가입 환영 메일 발송 테스트용' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Post('mail')
  async sendWelcomeMail(@Body() dto: SendMailRequest) {
    const mailData: WelcomeMailData = {
      email: dto.email,
    };

    await this.mailService.sendMail(dto.email, MailTemplate.Welcome, mailData);
  }
}
