import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { AvailableNftToOfferResponse } from './dto/available-nfts-to-offer.dto';
import { NftExchangeService } from './nft-exchange.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';

@Controller('nft-exchange')
export class NftExchangeController {
  constructor(private readonly nftExchangeService: NftExchangeService) {}

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '유저가 제공 가능한 NFT 목록 조회   (거래 등록 1단계에서 사용)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: AvailableNftToOfferResponse,
    },
  })
  @UseGuards(AuthGuard)
  @Get('available-nfts-to-offer')
  async getAvailableNftsToOffer(@AuthenticatedUser() user: UserEntity) {
    const result = await this.nftExchangeService.getAvailableNFTsToOffer(
      user.id,
      user.walletAddress,
    );
    
    return new ResponsesDataDto(result);
  }
}
