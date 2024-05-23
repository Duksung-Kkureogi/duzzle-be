import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PuzzleService } from './puzzle.service';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { PuzzleRequest, PuzzleResponse } from './dto/puzzle.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';

@Controller('puzzle')
export class PuzzleController {
  constructor(private readonly puzzleService: PuzzleService) {}

  @ApiTags('Puzzle')
  @ApiOperation({ summary: '퍼즐 현황 데이터' })
  @HttpCode(HttpStatus.OK)
  @ResponseData(PuzzleResponse)
  @Get(':seasonId')
  async getPuzzleData(
    @Param() dto: PuzzleRequest,
  ): Promise<ResponsesDataDto<PuzzleResponse>> {
    await this.puzzleService.getSeasonById(dto.seasonId);
    const result = await this.puzzleService.getPuzzleData(dto.seasonId);

    return new ResponsesDataDto(result);
  }
}
