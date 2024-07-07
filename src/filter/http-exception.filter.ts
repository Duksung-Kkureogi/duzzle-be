import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ApplicationException } from 'src/types/error/application-exceptions.base';

@Catch(ApplicationException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response
      .status(
        exception.getStatus
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      )
      .json({
        result: false,
        code: exception.code,
        message: exception.message,
      });
  }
}
