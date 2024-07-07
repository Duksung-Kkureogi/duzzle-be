import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionCode } from 'src/constant/exception';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(
        exception.getStatus ? exception.getStatus() : HttpStatus.NOT_FOUND,
      )
      .json({
        result: false,
        code: ExceptionCode.PageNotFound,
        message: exception.message,
      });
  }
}
