import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { NftExchangeService } from './nft-exchange.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';
import {
  NftExchangeListRequest,
  PostNftExchangeRequest,
} from './dto/nft-exchange.dto';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { AccessDenied } from 'src/types/error/application-exceptions/403-forbidden';
import { ActionNotPermittedError } from 'src/types/error/application-exceptions/409-conflict';
import { NftExchangeListDto } from './dto/nft-exchange-offer.dto';

@Controller('nft-exchange')
export class NftExchangeController {
  constructor(private readonly nftExchangeService: NftExchangeService) {}

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '유저가 제공 가능한 NFT 목록 조회   (거래 등록 1단계에서 사용)',
    description: '페이지네이션 없이 전체 목록 조회',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: AvailableNftDto,
    },
  })
  @UseGuards(AuthGuard)
  @Get('available-nfts-to-offer')
  async getAvailableNftsToOffer(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<AvailableNftDto>> {
    const result = await this.nftExchangeService.getAvailableNFTsToOffer(
      user.id,
      user.walletAddress,
    );

    return new ResponsesListDto(result);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '요청 가능한 NFT 목록 조회   (거래 등록 2단계에서 사용)',
    description: '페이지네이션 있음, name(구역 or 재료명) 으로 검색 가능',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: AvailableNftDto,
    },
  })
  @UseGuards(AuthGuard)
  @Get('available-nfts-to-request')
  async getAvailableNftsToRequest(
    @Query() params: AvailableNftsToRequestRequest,
  ) {
    const result =
      await this.nftExchangeService.getAvailableNFTsToRequest(params);

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 생성   (거래 등록 3단계에서 사용)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [ContentNotFoundError],
  })
  @UseGuards(AuthGuard)
  @Post()
  async postNftExchange(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: PostNftExchangeRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.nftExchangeService.postNftExchange(user.id, dto);

    return new ResponsesDataDto(true);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 취소',
    description: `
    교환 제안 취소 가능 상태: listed, failed
    * listed: 사용자가 제안을 등록하고 다른 사용자들이 볼 수 있는 상태
    * failed: 블록체인 트랜잭션 실패로 인해 교환이 실패한 상태
    `,
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [ContentNotFoundError, AccessDenied, ActionNotPermittedError],
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteNftExchange(
    @AuthenticatedUser() user: UserEntity,
    @Param('id') nftExchangeId: number,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.nftExchangeService.deleteNftExchange(user.id, nftExchangeId);

    return new ResponsesDataDto(true);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 목록',
    description:
      '페이지네이션 있음, 검색 조건: 거래 상태, 제안 nft, 요청 nft, 제안자(사용자명)',
    listResponse: {
      status: HttpStatus.OK,
      schema: NftExchangeListDto,
    },
  })
  @Get()
  async getNftExchangeList(@Query() params: NftExchangeListRequest) {
    const result = await this.nftExchangeService.getNftExchangeList(params);

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '내가 등록한 교환 제안 목록',
    description:
      '페이지네이션 있음, 검색 조건: 거래 상태, 제안 nft, 요청 nft, 제안자(사용자명)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: NftExchangeListDto,
    },
  })
  @UseGuards(AuthGuard)
  @Get('my')
  async getMyNftExchangeList(
    @AuthenticatedUser() user: UserEntity,
    @Query() params: NftExchangeListRequest,
  ) {
    const result = await this.nftExchangeService.getNftExchangeList(
      params,
      user.id,
    );

    return new ResponsesListDto(result.list, result.total);
  }
}
