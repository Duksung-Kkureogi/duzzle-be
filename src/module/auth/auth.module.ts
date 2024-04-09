import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [RepositoryModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
