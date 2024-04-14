import {
  Controller,
  HttpCode,
  Inject,
  Post,
  Get,
  HttpStatus,
  Body,
  Render,
  Res,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { LoginRequest, LoginResponse } from './dto/auth.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { HttpError } from 'src/types/http-exceptions';
import { ExceptionCode } from 'src/constant/exception';
import { ResponseException } from 'src/decorator/response-exception.decorator';

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

  @ApiTags('Auth')
  @ApiOperation({ summary: '로그인' })
  @ApiBearerAuth(AuthorizationToken.BearerLoginIdToken)
  @HttpCode(HttpStatus.OK)
  @ResponseData(LoginResponse)
  @ResponseException(HttpStatus.UNAUTHORIZED, [
    ExceptionCode.MissingAuthToken,
    ExceptionCode.InvalidLoginInfo,
    ExceptionCode.InvalidAddress,
    ExceptionCode.InvalidAccessToken,
  ])
  @Post()
  async login(
    @Body() params: LoginRequest,
  ): Promise<ResponsesDataDto<LoginResponse>> {
    const idToken =
      this.req.headers.authorization?.split(' ')[1] ||
      this.req.headers.authorization!;

    if (!idToken) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        ExceptionCode.MissingAuthToken,
      );
    }

    const result: LoginResponse = await this.authService.login(idToken, params);

    return new ResponsesDataDto(result);
  }
}
