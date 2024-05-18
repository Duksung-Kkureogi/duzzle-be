import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpStatus,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ExceptionCode } from 'src/constant/exception';
import { LoginJwtPayload } from './dto/auth.dto';
import { HttpError } from 'src/types/http-exceptions';
import { UserRepositoryService } from '../repository/service/user.repository.service';
import { ResponseExceptionAuth } from 'src/decorator/auth-exception.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(UserRepositoryService)
    private readonly userRepositoryService: UserRepositoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check jwt exists
    const token: string =
      req.headers.authorization?.split(' ')[1] || req.headers.authorization!;
    if (!token) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        ExceptionCode.MissingAuthToken,
      );
    }

    // Verify auth token
    try {
      this.jwtService.verify(token);
    } catch (e) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, ExceptionCode.TokenExpired);
    }

    // Get payload by auth token
    const payload: LoginJwtPayload = this.jwtService.decode(token);

    // Get User by id
    const user = await this.userRepositoryService.findUserById(payload.id);

    if (!user) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        ExceptionCode.InvalidAccessToken,
      );
    }

    req.user = user;

    return true;
  }
}

export function UserGuard() {
  return applyDecorators(UseGuards(AuthGuard), ResponseExceptionAuth());
}
