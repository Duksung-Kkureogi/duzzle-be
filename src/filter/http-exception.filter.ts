import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { HttpError } from 'src/types/http-exceptions';

@Catch(HttpError)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response
      .status(exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR) 
      .json({
        result: false,
        code: exception.code || 'INTERNAL_SERVER_ERROR',
        message: exception.message,
      });
  }
}
