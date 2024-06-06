import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ExceptionCode } from 'src/constant/exception';
import { HttpError } from './http-exceptions';
import { HttpStatus } from '@nestjs/common';

export const multerOptions: MulterOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const originName = Buffer.from(file.originalname, 'ascii').toString('utf8');

    const allowedCharacters = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣._-]+$/;
    console.log(allowedCharacters.test(originName));
    if (!allowedCharacters.test(originName)) {
      return cb(
        new HttpError(
          HttpStatus.BAD_REQUEST,
          ExceptionCode.InvalidFilenameCharacters,
        ),
        false,
      );
    }

    const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
    if (!allowedExtensions.test(file.originalname)) {
      return cb(
        new HttpError(
          HttpStatus.BAD_REQUEST,
          ExceptionCode.InvalidFileNameExtension,
        ),
        false,
      );
    }

    cb(null, true);
  },
};
