import { UserService } from './user.service';
import {
  Controller,
  HttpCode,
  Inject,
  Get,
  HttpStatus,
  Body,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import {
  ImageUploadDto,
  UpdateUserNameRequest,
  UserInfoResponse,
} from './dto/user.dto';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { ExceptionCode } from 'src/constant/exception';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { UserEntity } from '../repository/entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/types/file-options';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @ApiTags('User')
  @ApiOperation({
    summary: '유저 정보 조회',
    description: '로그인한 유저 정보 조회',
  })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(UserInfoResponse)
  @Get()
  async getUserInfo(): Promise<ResponsesDataDto<UserInfoResponse>> {
    const { user } = this.req;
    const result = await this.userService.getUserInfo(user.id);

    return new ResponsesDataDto(result);
  }

  @ApiTags('User')
  @ApiOperation({
    summary: '유저 이름 변경',
    description: '이미 존재하는 이름일 경우 409 ALREADY_EXISTS',
  })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(UserInfoResponse)
  @ResponseException(HttpStatus.CONFLICT, [ExceptionCode.DuplicateValues])
  @Patch('name')
  async updateUserName(
    @Body() dto: UpdateUserNameRequest,
  ): Promise<ResponsesDataDto<UserInfoResponse>> {
    const { user } = this.req;
    const result = await this.userService.updateUserName(user.id, dto.name);

    return new ResponsesDataDto(result);
  }

  @ApiTags('Tmp')
  @ApiOperation({
    summary: '개발용 전체 유저 목록',
  })
  @Get('list')
  async getUsers(): Promise<ResponsesListDto<UserEntity>> {
    const users = await this.userService.getUsers();

    return new ResponsesListDto(users);
  }

  @ApiTags('User')
  @ApiOperation({ summary: '유저 프로필 이미지 변경' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImageUploadDto, required: false })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(HttpStatus.OK)
  @ResponseData(UserInfoResponse)
  @Patch('image')
  async updateUserImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponsesDataDto<UserInfoResponse>> {
    const { user } = this.req;
    const result = await this.userService.updateUserImage(user.id, file);

    return new ResponsesDataDto(result);
  }
}
