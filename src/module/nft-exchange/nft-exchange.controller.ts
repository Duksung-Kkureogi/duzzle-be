import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { PostNftExchangeRequest } from './dto/nft-exchange.dto';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';

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
}
