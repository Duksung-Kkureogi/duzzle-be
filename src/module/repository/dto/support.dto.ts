import { QuestionCategory } from 'src/module/support/dto/support.dto';

export class PostQuestionDto {
  userId: number;
  question: string;
  category: QuestionCategory;
  email: string;
}
