import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepositoryService } from './service/user.repository.service';
import { SupportRepositoryService } from './service/support.repository.service';
import { FaqEntity } from './entity/faq.entity';
import { QnaEntity } from './entity/qna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FaqEntity, QnaEntity])],
  providers: [UserRepositoryService, SupportRepositoryService],
  exports: [UserRepositoryService, SupportRepositoryService],
})
export class RepositoryModule {}
