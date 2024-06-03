export class StoryDto {
  id: number;
  speaker: string;
  content: string;
  image?: string;
}

export class InsertUserStoryDto {
  userId: number;
  storyId: number;
  readPage: number;
}

export class UpdateUserStoryDto {
  userId: number;
  storyId: number;
  readPage: number;
}
