import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PuzzlePieceEntity } from '../entity/puzzle-piece.entity';
import { SeasonEntity } from '../entity/season.entity';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';

@Injectable()
export class PuzzleRepositoryService {
  constructor(
    @InjectRepository(PuzzlePieceEntity)
    private puzzlePieceRepository: Repository<PuzzlePieceEntity>,

    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,
  ) {}

  async getSeasonById(seasonId: number): Promise<SeasonEntity> {
    const season = await this.seasonRepository.findOneBy({ id: seasonId });
    if (!season) {
      throw new ServiceError(ExceptionCode.NotFound);
    }

    return season;
  }

  async getPuzzlePiecesBySeasonId(
    seasonId: number,
  ): Promise<PuzzlePieceEntity[]> {
    const allPiecesInSeason = await this.puzzlePieceRepository.find({
      where: {
        seasonZone: {
          seasonId,
        },
      },
      relations: {
        seasonZone: {
          season: true,
          zone: true,
          requiredItems: {
            item: {
              nftContract: true,
            },
          },
        },
        metadata: {
          nft: true,
        },
        owner: true,
      },
    });

    return allPiecesInSeason;
  }
}
