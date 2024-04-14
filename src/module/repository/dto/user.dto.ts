import { LoginType } from '../enum/user.enum';

export class InsertUserDto {
  loginType: LoginType;
  walletAddress: string;
  email?: string;
  name?: string;
}

export class UpdateUserDto {
  id: number;
  name?: string;
}
