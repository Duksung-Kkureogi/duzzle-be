import { UserRepositoryService } from './user.repository.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { PuzzlePieceEntity } from '../entity/puzzle-piece.entity';
import { SeasonEntity } from '../entity/season.entity';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { UserPuzzleRequest } from 'src/module/puzzle/user.puzzle.dto';
import { PaginatedList } from 'src/dto/response.dto';

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

  async getAllSeasons(): Promise<SeasonEntity[]> {
    return await this.seasonRepository.find();
  }

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
      order: { id: 'ASC' },
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

  async findPuzzlesByUserId(
    userId: number,
    params: UserPuzzleRequest,
  ): Promise<PaginatedList<PuzzlePieceEntity>> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    const { count, page } = params;
    const offset = count * page;

    const where: FindOptionsWhere<PuzzlePieceEntity> = {
      holerWalletAddress: userWalletAddress,
    };

    if (params?.season !== undefined) {
      where.seasonZone = {
        season: {
          id: params.season,
        },
      };
    }

    if (params?.zone !== undefined) {
      where.seasonZone = {
        zone: {
          id: params.zone,
        },
      };
    }

    const findOption: FindManyOptions<PuzzlePieceEntity> = {
      where,
      relations: {
        metadata: true,
        seasonZone: {
          season: true,
          zone: true,
        },
      },
      skip: offset,
      take: count,
      order: { createdAt: 'DESC' },
    };

    const [list, total] =
      await this.puzzlePieceRepository.findAndCount(findOption);

    const result: PaginatedList<PuzzlePieceEntity> = {
      list,
      total,
    };

    return result;
  }

  async getPuzzleByIdAndUserId(
    userId: number,
    puzzleId: number,
  ): Promise<PuzzlePieceEntity> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    const puzzle = await this.puzzlePieceRepository.findOne({
      where: {
        id: puzzleId,
        holerWalletAddress: userWalletAddress,
      },
      relations: {
        metadata: true,
        seasonZone: {
          season: true,
          zone: true,
        },
      },
    });

    if (!puzzle) {
      throw new ServiceError(ExceptionCode.NotFound);
    }

    return puzzle;
  }

  async getTotalPiecesByUser(userId: number): Promise<number> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    const totalPieces = await this.puzzlePieceRepository.countBy({
      holerWalletAddress: userWalletAddress,
    });

    return totalPieces;
  }
}
