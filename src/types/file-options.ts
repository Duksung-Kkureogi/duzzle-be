import { BadRequestException } from '@nestjs/common';
import { Options, diskStorage } from 'multer';

export const multerOptions: Options = {
  storage: diskStorage({
    filename: (req, file, cb) => {
      const originlName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
      if (originlName !== file.originalname) {
        return cb(
          new BadRequestException('파일명에 특수문자를 포함할 수 없습니다.'),
          '',
        );
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
    if (!allowedExtensions.test(file.originalname)) {
      new BadRequestException('지원되지 않는 파일 형식입니다.');
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
