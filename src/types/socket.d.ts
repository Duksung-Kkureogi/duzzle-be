import 'socket.io';
import { LoginJwtPayload } from 'src/module/auth/dto/auth.dto';

declare module 'socket.io' {
  interface Socket {
    user?: LoginJwtPayload;
  }
}
