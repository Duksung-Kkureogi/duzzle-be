import { Injectable } from '@nestjs/common';

import { SupportRepositoryService } from '../repository/service/support.repository.service';
import { FaqResponse } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(
    private readonly userRepositoryService: SupportRepositoryService,
  ) {}

  async getFaqs(): Promise<FaqResponse[]> {
    const faqs = await this.userRepositoryService.getFaqList();
    const result = faqs.map((e) => FaqResponse.from(e));

    return result;
  }
}
