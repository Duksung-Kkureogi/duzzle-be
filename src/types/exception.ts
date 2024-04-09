import { CodeToStatus, ExceptionCode } from 'src/constant/exception';
import { HttpStatus } from '@nestjs/common';

export class ServiceError extends Error {
  code: ExceptionCode;

  constructor(code?: ExceptionCode, err?: Error) {
    super();
    this.code = code || ExceptionCode.InternalServerError;

    if (err) {
      this.name = err.name;
      this.message = err.message;
      this.stack = err.stack;
    }
  }

  getStatus(): HttpStatus {
    return CodeToStatus?.[this.code];
  }
}
