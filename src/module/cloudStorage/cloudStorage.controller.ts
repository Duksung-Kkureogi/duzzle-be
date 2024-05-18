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
import { uuid } from 'uuidv4';
import { CloudStorageService } from './cloudStorage.service';
import { ImageUploadDto } from './dto/cloudStorage.dto';
import { multerOptions } from 'src/types/file-options';

@Controller({
  path: 'aws',
})
export class CloudStorageController {
  constructor(
    @Inject(CloudStorageService)
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  @ApiTags('Aws')
  @ApiOperation({ summary: 'AWS 이미지 등록 테스트용' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(HttpStatus.OK)
  @Post('image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageName = uuid();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.cloudStorageService.uploadFile(
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
    await this.cloudStorageService.deleteFile(imageName);
  }
}
