import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from 'src/module/config/config.service';

import { LoginType } from '../repository/enum/user.enum';
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

  async getUserByWalletAddress(walletAddress: string): Promise<UserEntity> {
    console.log('getUserByWalletAddress');
    return null;
  }

  async insertUser(
    loginType: LoginType,
    walletAddres: string,
    email: string,
  ): Promise<UserEntity> {
    return;
  }

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
    const { walletAddress, email, loginType } = params;
    let user = await this.getUserByWalletAddress(walletAddress);
    if (!user) {
      user = await this.insertUser(loginType, walletAddress, email);
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
