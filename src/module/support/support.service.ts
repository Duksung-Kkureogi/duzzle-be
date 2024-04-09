import { Injectable } from '@nestjs/common';

import { SupportRepositoryService } from '../repository/service/support.repository.service';
import { FaqResponse, PostQuestionRequest } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(
    private readonly supportRepositoryService: SupportRepositoryService,
  ) {}

  async getFaqs(): Promise<FaqResponse[]> {
    const faqs = await this.supportRepositoryService.getFaqList();
    const result = faqs.map((e) => FaqResponse.from(e));

    return result;
  }

  async postQuestion(
    userId: number,
    params: PostQuestionRequest,
  ): Promise<void> {
    const { category, email, question } = params;
    await this.supportRepositoryService.postQuestion({
      userId,
      category,
      email,
      question,
    });
  }
}
