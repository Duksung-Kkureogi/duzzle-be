import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ExceptionCode } from 'src/constant/exception';
import { ConfigService } from 'src/module/config/config.service';

@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionObj = exception.getResponse() as Record<string, any>;

    const isProduction = ConfigService.isProduction();

    response.status(exception.getStatus()).json({
      result: false,
      code: ExceptionCode.InvalidParameter,
      message: isProduction ? exceptionObj.error : exceptionObj.message,
    });
  }
}
