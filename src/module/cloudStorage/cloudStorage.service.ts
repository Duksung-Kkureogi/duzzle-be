import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from 'src/module/config/config.service';
import { ServiceError } from 'src/types/exception';
import { ExceptionCode } from 'src/constant/exception';

@Injectable()
export class CloudStorageService {
  s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ContentType: `image/${ext}`,
    });

    try {
      await this.s3Client.send(command);

      return `https://s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${this.configService.get<string>('AWS_S3_BUCKET_NAME')}/${fileName}`;
    } catch (e) {
      throw new ServiceError(ExceptionCode.InternalServerError, new Error(e));
    }
  }

  async deleteFile(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileName,
    });

    try {
      await this.s3Client.send(command);
    } catch (e) {
      throw new ServiceError(ExceptionCode.InternalServerError, new Error(e));
    }
  }
}
