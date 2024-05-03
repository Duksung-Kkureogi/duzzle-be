import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { verify, JwtHeader, decode } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import Web3 from 'web3';

import { ConfigService } from 'src/module/config/config.service';
import { UserRepositoryService } from '../repository/service/user.repository.service';
import {
  JWT,
  LoginJwtPayload,
  LoginRequest,
  LoginResponse,
  UserDto,
} from './dto/auth.dto';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';
import { LoginType } from '../repository/enum/user.enum';
import { WelcomeMailData } from 'src/types/mail-data';
import { MailService } from '../email/email.service';
import { MailTemplate } from '../repository/enum/mail.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly mailService: MailService,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  private async getKey(
    isWalletLogin: boolean,
    header: JwtHeader,
  ): Promise<string> {
    const jwksUri: string = isWalletLogin
      ? ConfigService.getConfig().WEB3AUTH_JWKS_ENDPOINT.EXTERNAL_WALLET
      : ConfigService.getConfig().WEB3AUTH_JWKS_ENDPOINT.SOCIAL_LOGIN;

    const client = jwksClient({
      jwksUri,
    });
    const publicKey = (await client.getSigningKey(header.kid)).getPublicKey();

    return publicKey;
  }

  private async verifyLoginIdToken(
    idToken: string,
    params: LoginRequest,
  ): Promise<any> {
    const isWalletLogin: boolean = params.loginType === LoginType.Metamask;
    let payload: any;
    try {
      const secret = await this.getKey(
        isWalletLogin,
        decode(idToken, { complete: true }).header,
      );
      payload = verify(idToken, secret);
    } catch (e) {
      Logger.error(this.verifyLoginIdToken.name, e.stack);

      throw new ServiceError(ExceptionCode.InvalidAccessToken, e);
    }

    // TODO: Social Login 일 경우 body.app_pub_key, payload.wallets.app_pub_key 확인 필요
    if (
      isWalletLogin &&
      (payload?.['wallets'][0]?.['address'] as string).toLowerCase() !==
        params.walletAddress.toLowerCase()
    ) {
      throw new ServiceError(ExceptionCode.InvalidAddress);
    }

    const loginProvider: string = payload?.aggregateVerifier || payload?.iss;
    if (!loginProvider.includes(params.loginType.toLowerCase())) {
      throw new ServiceError(ExceptionCode.InvalidLoginInfo);
    }

    return payload;
  }

  private async generateLoginJwt(dto: LoginJwtPayload): Promise<JWT> {
    const payload = JSON.parse(
      JSON.stringify({
        id: dto.id,
        walletAddress: dto.walletAddress,
      }),
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ConfigService.getConfig().JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: ConfigService.getConfig().JWT_REFRESH_EXPIRES_IN,
    });

    const result = {
      accessToken,
      refreshToken,
    };

    return result;
  }

  async login(idToken: string, params: LoginRequest): Promise<LoginResponse> {
    const payload = await this.verifyLoginIdToken(idToken, params);
    const { walletAddress, loginType } = params;
    const checksummedAddresses = Web3.utils.toChecksumAddress(walletAddress);
    let user =
      await this.userRepositoryService.findUserByWalletAddress(
        checksummedAddresses,
      );

    // 이미 등록된 지갑 주소인데 요청 로그인 타입이 다름
    if (user && user?.loginType !== params.loginType) {
      throw new ServiceError(ExceptionCode.InvalidLoginInfo);
    }
    if (!user) {
      user = await this.userRepositoryService.insertUser({
        loginType,
        walletAddress: checksummedAddresses,
        email: payload?.email,
      });

      if (user.email) {
        const mailData: WelcomeMailData = {
          email: user.email,
        };

        try {
          await this.mailService.sendMail(
            user.email,
            MailTemplate.Welcome,
            mailData,
          );
        } catch (err) {
          // TODO: 에러 알림 발송
          Logger.error(err.message, err.stack);
        }
      }
    }

    const jwt: JWT = await this.generateLoginJwt({
      walletAddress,
      id: user.id,
    });

    return {
      ...jwt,
      user: UserDto.from(user),
    };
  }
}
