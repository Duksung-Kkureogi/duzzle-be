import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionCode, ExceptionMessage } from 'src/constant/exception';

export type HttpErrorDto = {
  status: HttpStatus;
  code: ExceptionCode;
};

export class HttpError extends HttpException {
  code: string;

  constructor(status: HttpStatus, code: ExceptionCode, message?: string) {
    super(message || ExceptionMessage[code] || 'error', status);
    this.code = code || 'UNDEFINED_CODE';
  }
}
