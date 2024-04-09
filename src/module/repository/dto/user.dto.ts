import { LoginType } from '../enum/user.enum';

export class InsertUserDto {
  loginType: LoginType;
  walletAddress: string;
  email?: string;
}

export class UpdateUserDto {
  id: number;
  name?: string;
}
