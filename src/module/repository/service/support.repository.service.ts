import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqEntity } from '../entity/faq.entity';
import { QnaEntity } from '../entity/qna.entity';
import { PostQuestionDto } from '../dto/support.dto';
import { ExceptionCode } from 'src/constant/exception';
import { ServiceError } from 'src/types/exception';

@Injectable()
export class SupportRepositoryService {
  constructor(
    @InjectRepository(FaqEntity)
    private faqRepository: Repository<FaqEntity>,

    @InjectRepository(QnaEntity)
    private qnaRepository: Repository<QnaEntity>,
  ) {}

  async getFaqList(): Promise<FaqEntity[]> {
    const faqs = await this.faqRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });

    return faqs;
  }

  async postQuestion(dto: PostQuestionDto): Promise<QnaEntity> {
    const qnaEntity = this.qnaRepository.create(dto);
    await this.qnaRepository.insert(qnaEntity);

    return qnaEntity;
  }

  async updateQuestion(
    questionId: number,
    dto: PostQuestionDto,
  ): Promise<void>  {
    await this.qnaRepository.update({ id: questionId, userId: dto.userId }, dto ) 
    // { id, userId } 문의 ID와 사용자 ID가 모두 일치하는 문의 조회
  }

  async deleteQuestion(questionId): Promise<void> {
    await this.qnaRepository.delete(questionId)
    // delete() 삭제할 엔티티의 조건 전달
    // remove(QnaEntity) 삭제할 엔티티의 인스턴스 전달 
  }

  async getQuestionById(questionId: number): Promise<QnaEntity> {
    const question = this.qnaRepository.findOneBy({ id: questionId })
    // findOneBy : Where 조건만 입력
    // findOne({ where:{ id: questionId} }) : 더 다양한 조건을 넣을 수 있음

    if (!question) {
      throw new ServiceError(ExceptionCode.NotFound)
    }

    return question
  }

  // 함수 이름, 반환 타입, 함수의 유의미성 ???
  async checkPermission(
    userId: number,
    author: number,
  ): Promise<void> {
    if (userId !== author) {
      throw new ServiceError(ExceptionCode.NotFound)
    }
  }

  async getQnaList(userId: number): Promise<QnaEntity[]> {
    const qnas = await this.qnaRepository.find({
      where: {
        userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return qnas;
  }
}
