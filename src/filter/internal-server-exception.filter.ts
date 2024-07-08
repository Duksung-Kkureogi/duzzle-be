import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ExceptionCode } from 'src/constant/exception';

@Catch()
export class InternalServerErrorFilter extends BaseExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // Error Log
    Logger.error(exception.message);
    Logger.error(exception.stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      result: false,
      code: ExceptionCode.InternalServerError,
      message: '내부 서버 오류가 발생했습니다.',
    });
  }
}
