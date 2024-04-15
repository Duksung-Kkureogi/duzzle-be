import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqEntity } from '../entity/faq.entity';
import { QnaEntity } from '../entity/qna.entity';
import { PostQuestionDto } from '../dto/support.dto';
import { UpdateUserDto } from '../dto/user.dto';
import { UpdateUserNameRequest } from 'src/module/user/dto/user.dto';

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
    // userId: number,
    questionId: number,
    dto: PostQuestionDto, // UpdateQuestionDto ???
  ): Promise<void>  {
    const userId = dto.userId // ???
    await this.qnaRepository.update({ id: questionId, userId }, dto ) 
    // { id: questionId, userId } 문의 ID와 사용자 ID가 모두 일치하는 문의 조회
  }

  async deleteQuestion(questionId): Promise<void> {
    await this.qnaRepository.delete(questionId)
    // delete() 삭제할 엔티티의 조건 전달
    // remove(QnaEntity) 삭제할 엔티티의 인스턴스 전달 
  }

  // async getQuestionById(questionId: number): Promise<QnaEntity> {
  //   const id = questionId
  //   return this.qnaRepository.findOneBy({ id })
  //   // return this.qnaRepository.findOne(questionId) => ERROR!!!
  // }

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
