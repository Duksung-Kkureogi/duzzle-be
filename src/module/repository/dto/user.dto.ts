import { LoginType } from '../enum/user.enum';
import { UserStoryProgressDto } from './story.dto';

export class InsertUserDto {
  loginType: LoginType;
  walletAddress: string;
  email?: string;
}

export class UpdateUserDto {
  id: number;
  name?: string;
  image?: string;
  storyProgress?: UserStoryProgressDto[];
}
