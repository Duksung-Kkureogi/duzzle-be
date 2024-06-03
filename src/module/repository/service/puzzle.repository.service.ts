import { UserRepositoryService } from './user.repository.service';
import { Inject, Injectable } from '@nestjs/common';
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

    @Inject(UserRepositoryService)
    private userRepositoryService: UserRepositoryService,
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
          requiredMaterialItems: {
            materialItem: {
              contract: true,
            },
          },
        },
        metadata: {
          contract: true,
        },
      },
    });

    return allPiecesInSeason;
  }

  async updateOwner(tokenId: number, walletAddress: string): Promise<void> {
    const userName = (
      await this.userRepositoryService.findUserByWalletAddress(walletAddress)
    )?.name;
    await this.puzzlePieceRepository.query(
      `
    UPDATE puzzle_piece pp
    SET minted               = true,
        holder_name          = $1,
        holer_wallet_address = $2
    WHERE pp.id = (
                    SELECT pp_inner.id
                    FROM puzzle_piece pp_inner
                        JOIN nft_metadata nft ON pp_inner.nft_metadata_id = nft.id
                    WHERE nft.token_id = $3
                    LIMIT 1);`,
      [userName, walletAddress, tokenId],
    );
  }
}
