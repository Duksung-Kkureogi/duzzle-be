import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

import { LoginJwtPayload } from 'src/module/auth/dto/auth.dto';

@Injectable()
export class WebsocketUserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const authToken =
      client.handshake.auth?.token?.split(' ')[1] ||
      client.handshake.auth?.token;

    if (!authToken) {
      throw new WsException('Missing token');
    }

    try {
      const decoded: LoginJwtPayload = this.jwtService.verify(authToken);
      client.user = decoded;

      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }
}
