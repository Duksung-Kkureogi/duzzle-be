import {
  Controller,
  HttpCode,
  Inject,
  Post,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { LoginRequest, LoginResponse } from './dto/auth.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import {
  IncorrectLoginInfo,
  InvalidIdTokenError,
  InvalidWalletAddress,
  MissingWeb3IdTokenError,
} from 'src/types/error/application-exceptions/401-unautorized';
import { ApiDescription } from 'src/decorator/api-description.decorator';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @ApiDescription({
    tags: 'Auth',
    summary: '로그인',
    auth: AuthorizationToken.BearerLoginIdToken,
    dataResponse: {
      status: HttpStatus.OK,
      schema: LoginResponse,
    },
    exceptions: [
      MissingWeb3IdTokenError,
      InvalidIdTokenError,
      InvalidWalletAddress,
      IncorrectLoginInfo,
    ],
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async login(
    @Body() params: LoginRequest,
  ): Promise<ResponsesDataDto<LoginResponse>> {
    const idToken =
      this.req.headers.authorization?.split(' ')[1] ||
      this.req.headers.authorization!;

    if (!idToken) {
      throw new MissingWeb3IdTokenError();
    }

    const result: LoginResponse = await this.authService.login(idToken, params);

    return new ResponsesDataDto(result);
  }
}
