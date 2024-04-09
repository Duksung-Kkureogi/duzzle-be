import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from 'src/module/config/config.service';

import { UserRepositoryService } from '../repository/service/user.repository.service';
import { UserEntity } from '../repository/entity/user.entity';
import {
  JWT,
  LoginJwtPayload,
  LoginRequest,
  LoginResponse,
  UserDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async updateUser(user: UserEntity): Promise<UserEntity> {
    const result = await this.userRepositoryService.saveUser(user);

    return result;
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

  async login(params: LoginRequest): Promise<LoginResponse> {
    // 로그인 요청 유저 유효성 검증
    const { walletAddress, email, loginType } = params;
    let user =
      await this.userRepositoryService.findUserByWalletAddress(walletAddress);
    if (!user) {
      user = await this.userRepositoryService.insertUser({
        loginType,
        walletAddress,
        email,
      });
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
