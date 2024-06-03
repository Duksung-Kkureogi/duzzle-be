import { Injectable } from '@nestjs/common';

import { PuzzlePieceDto, PuzzleResponse } from './dto/puzzle.dto';
import { PuzzleRepositoryService } from '../repository/service/puzzle.repository.service';
import { NftRepositoryService } from './../repository/service/nft.repository.service';
import { SeasonEntity } from '../repository/entity/season.entity';
import {
  UserPuzzleDetailResponse,
  UserPuzzleRequest,
  UserPuzzleResponse,
} from './user.puzzle.dto';
import { PaginatedList } from 'src/dto/response.dto';
import { ContractKey } from '../repository/enum/contract.enum';

@Injectable()
export class PuzzleService {
  constructor(
    private readonly puzzleRepositoryService: PuzzleRepositoryService,
    private readonly nftRepositoryService: NftRepositoryService,
  ) {}

  async getSeasonById(id: number): Promise<SeasonEntity> {
    const season = await this.puzzleRepositoryService.getSeasonById(id);

    return season;
  }

  async getPuzzleData(seasonId: number): Promise<PuzzleResponse> {
    const _pieces =
      await this.puzzleRepositoryService.getPuzzlePiecesBySeasonId(seasonId);
    const minted = _pieces.filter((e) => e.minted).length;

    const total = _pieces[0].seasonZone.season.totalPieces;
    const result: PuzzleResponse = {
      total,
      minted,
      pieces: _pieces.map((e) => PuzzlePieceDto.from(e)),
    };

    return result;
  }

  async getPuzzlesByUserId(
    userId: number,
    params: UserPuzzleRequest,
  ): Promise<PaginatedList<UserPuzzleResponse>> {
    const { list, total } =
      await this.puzzleRepositoryService.findPuzzlesByUserId(userId, params);

    const result: PaginatedList<UserPuzzleResponse> = {
      list: list.map((e) => UserPuzzleResponse.from(e)),
      total,
    };

    return result;
  }

  async getPuzzleById(
    userId: number,
    puzzleId: number,
  ): Promise<UserPuzzleDetailResponse> {
    const contractAddress = (
      await this.nftRepositoryService.findContractByKey(
        ContractKey.PUZZLE_PIECE,
      )
    ).address;
    const puzzle = await this.puzzleRepositoryService.getPuzzleByIdAndUserId(
      userId,
      puzzleId,
    );

    return UserPuzzleDetailResponse.from(puzzle, contractAddress);
  }
}
