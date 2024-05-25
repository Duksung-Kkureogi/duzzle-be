import { Injectable } from '@nestjs/common';

import { PuzzlePieceDto, PuzzleResponse } from './dto/puzzle.dto';
import { PuzzleRepositoryService } from '../repository/service/puzzle.repository.service';
import { SeasonEntity } from '../repository/entity/season.entity';

@Injectable()
export class PuzzleService {
  constructor(
    private readonly puzzleRepositoryService: PuzzleRepositoryService,
  ) {}

  async getSeasonById(id: number): Promise<SeasonEntity> {
    const season = await this.puzzleRepositoryService.getSeasonById(id);

    return season;
  }

  async getPuzzleData(seasonId: number): Promise<PuzzleResponse> {
    const _pieces =
      await this.puzzleRepositoryService.getPuzzlePiecesBySeasonId(seasonId);
    const minted = _pieces.map((e) => e.minted).length;

    const total = _pieces[0].seasonZone.season.totalPieces;
    const result: PuzzleResponse = {
      total,
      minted,
      pieces: _pieces.map((e) => PuzzlePieceDto.from(e)),
    };

    return result;
  }
}
