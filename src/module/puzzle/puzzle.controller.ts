import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { ResponseList } from 'src/decorator/response-list.decorators';
import {
  UserPuzzleDetailResponse,
  UserPuzzlePathParams,
  UserPuzzleRequest,
  UserPuzzleResponse,
} from './user.puzzle.dto';
import { SeasonEntity } from '../repository/entity/season.entity';
import { Zone, ZONES } from 'src/constant/zones';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';

@ApiTags('Puzzle')
@Controller()
export class PuzzleController {
  constructor(private readonly puzzleService: PuzzleService) {}

  @ApiOperation({ summary: '전체 시즌 목록' })
  @HttpCode(HttpStatus.OK)
  @ResponseList(SeasonEntity)
  @Get('seasons')
  async getAllSeasons(): Promise<ResponsesListDto<SeasonEntity>> {
    const seaons = await this.puzzleService.getAllSeasons();

    return new ResponsesListDto(seaons);
  }

  @ApiOperation({ summary: '전체 구역 목록' })
  @HttpCode(HttpStatus.OK)
  @ResponseList(Zone)
  @Get('zones')
  async getAllZones(): Promise<ResponsesListDto<Zone>> {
    return new ResponsesListDto(ZONES);
  }

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
    @AuthenticatedUser('id') userId: number,
    @Query() params: UserPuzzleRequest,
  ): Promise<ResponsesListDto<UserPuzzleResponse>> {
    const result = await this.puzzleService.getPuzzlesByUserId(userId, params);

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiOperation({ summary: '유저 보유 퍼즐 조각 NFT 상세' })
  @ApiBearerAuth(AuthorizationToken.BearerUserToken)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseData(UserPuzzleDetailResponse)
  @Get('my/nft-puzzles/:id')
  async getUserPuzzleById(
    @AuthenticatedUser('id') userId: number,
    @Param() params: UserPuzzlePathParams,
  ): Promise<ResponsesDataDto<UserPuzzleDetailResponse>> {
    const puzzle = await this.puzzleService.getPuzzleById(userId, params.id);

    return new ResponsesDataDto(puzzle);
  }
}
