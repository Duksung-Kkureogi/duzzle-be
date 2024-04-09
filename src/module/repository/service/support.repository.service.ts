import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqEntity } from '../entity/faq.entity';

@Injectable()
export class SupportRepositoryService {
  constructor(
    @InjectRepository(FaqEntity)
    private faqRepository: Repository<FaqEntity>,
  ) {}

  async getFaqList(): Promise<FaqEntity[]> {
    const faqs = await this.faqRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });

    return faqs;
  }
}
