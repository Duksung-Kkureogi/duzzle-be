import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PuzzleService } from './puzzle.service';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { PuzzleRequest, PuzzleResponse } from './dto/puzzle.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ResponseList } from 'src/decorator/response-list.decorators';
import {
  UserPuzzleDetailResponse,
  UserPuzzlePathParams,
  UserPuzzleRequest,
  UserPuzzleResponse,
} from './user.puzzle.dto';

@Controller()
export class PuzzleController {
  constructor(
    @Inject(REQUEST)
    private req: Request,
    private readonly puzzleService: PuzzleService,
  ) {}

  @ApiTags('Puzzle')
  @ApiOperation({ summary: '퍼즐 현황 데이터' })
  @HttpCode(HttpStatus.OK)
  @ResponseData(PuzzleResponse)
  @Get('puzzle/:seasonId')
  async getPuzzleData(
    @Param() dto: PuzzleRequest,
  ): Promise<ResponsesDataDto<PuzzleResponse>> {
    await this.puzzleService.getSeasonById(dto.seasonId);
    const result = await this.puzzleService.getPuzzleData(dto.seasonId);

    return new ResponsesDataDto(result);
  }

  @ApiOperation({ summary: '유저 보유 퍼즐 조각 NFT 목록' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseList(UserPuzzleResponse)
  @Get('my/nft-puzzles')
  async getUserPuzzles(
    @Query() params: UserPuzzleRequest,
  ): Promise<ResponsesListDto<UserPuzzleResponse>> {
    const user = this.req.user;
    const result = await this.puzzleService.getPuzzlesByUserId(user.id, params);

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiOperation({ summary: '유저 보유 퍼즐 조각 NFT 상세' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(UserPuzzleResponse)
  @Get('my/nft-puzzles/:id')
  async getUserPuzzleById(
    @Param() params: UserPuzzlePathParams,
  ): Promise<ResponsesDataDto<UserPuzzleDetailResponse>> {
    const user = this.req.user;
    const puzzle = await this.puzzleService.getPuzzleById(user.id, params.id);

    return new ResponsesDataDto(puzzle);
  }
}
