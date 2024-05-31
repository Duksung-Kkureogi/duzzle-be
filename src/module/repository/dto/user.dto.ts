import { StoryProgressDto } from 'src/module/story/dto/story.dto';
import { LoginType } from '../enum/user.enum';

export class InsertUserDto {
  loginType: LoginType;
  walletAddress: string;
  email?: string;
}

export class UpdateUserDto {
  id: number;
  name?: string;
  image?: string;
}

export class InsertUserStoryDto {
  seasonId: number;
  userId: number;
  storyProgress: StoryProgressDto[];
}

export class UpdateUserStoryDto {
  id: number;
  storyProgress: StoryProgressDto[];
}
