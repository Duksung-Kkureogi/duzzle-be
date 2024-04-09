import { LoginType } from '../enum/user.enum';

export class InsertUserDto {
  loginType: LoginType;
  walletAddress: string;
  email?: string;
}
