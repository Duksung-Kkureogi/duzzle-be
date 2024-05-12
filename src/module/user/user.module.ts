import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [RepositoryModule, AwsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
