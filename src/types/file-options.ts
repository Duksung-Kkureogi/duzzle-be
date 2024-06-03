import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const originName = Buffer.from(file.originalname, 'ascii').toString('utf8');

    const allowedCharacters = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣._-]+$/;
    if (!allowedCharacters.test(originName)) {
      return cb(
        new BadRequestException('파일명에 특수문자를 포함할 수 없습니다.'),
        false,
      );
    }

    const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
    if (!allowedExtensions.test(file.originalname)) {
      return cb(
        new BadRequestException('지원되지 않는 파일 형식입니다.'),
        false,
      );
    }

    cb(null, true);
  },
};
