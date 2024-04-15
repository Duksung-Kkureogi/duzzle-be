import { Injectable } from '@nestjs/common';

import { SupportRepositoryService } from '../repository/service/support.repository.service';
import {
  FaqResponse,
  PostQuestionRequest,
  QnaResponse,
} from './dto/support.dto';

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

  async updateQuestion(
    userId: number,
    questionId: number,
    params: PostQuestionRequest, // UpdateQuestionRequest ???
  ): Promise<void> {
    const { category, email, question } = params
    await this.supportRepositoryService.updateQuestion(questionId, {
      userId,
      category,
      email,
      question,
    })
  }

  async deleteQuestion(
    userId: number, // => delete 요청자
    questionId: number,
  ): Promise<void> {
    // const question = await this.supportRepositoryService.getQuestionById(questionId)
    // if (!question) {} // Question not found
    // if (question.userId != userId) {}// question.userId => 글 작성자, not authorized to delete question
    await this.supportRepositoryService.deleteQuestion(questionId)
  }

  async getQnasByUserId(userId: number): Promise<QnaResponse[]> {
    const qnas = await this.supportRepositoryService.getQnaList(userId);
    const result = qnas.map((e) => QnaResponse.from(e));

    return result;
  }
}
