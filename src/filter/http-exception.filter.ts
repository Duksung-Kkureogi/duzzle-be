import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ExceptionMessage } from 'src/constant/exception';
import { ServiceError } from 'src/types/exception';
import { HttpError } from 'src/types/http-exceptions';

@Catch(HttpError, ServiceError)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpError | ServiceError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response
      .status(
        exception.getStatus
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      )
      .json({
        result: false,
        code: exception.code || 'INTERNAL_SERVER_ERROR',
        message: exception.message || ExceptionMessage[exception.code],
      });
  }
}
