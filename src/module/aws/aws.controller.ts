import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AwsService } from './aws.service';
import { uuid } from 'uuidv4';
import { ImageUploadDto } from './dto/aws.dto';

@Controller({
  path: 'aws',
})
export class AwsController {
  constructor(
    @Inject(AwsService)
    private readonly awsService: AwsService,
  ) {}

  @ApiTags('Aws')
  @ApiOperation({ summary: 'AWS 이미지 등록 테스트용' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Post('image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageName = uuid();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.uploadFile(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }

  @ApiTags('Aws')
  @ApiOperation({ summary: 'AWS 이미지 삭제 테스트용' })
  @HttpCode(HttpStatus.OK)
  @Delete('image/:imageName')
  async deleteImage(@Param('imageName') imageName: string) {
    await this.awsService.deleteFile(imageName);
  }
}
