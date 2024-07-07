import { HttpStatus } from '@nestjs/common';

// 내부 에러 코드, HTTP 응답 코드 겸용
export enum ExceptionCode {
  // 400 (Bad Request)
  InvalidParameter = 'INVALID_PARAMETER',
  NoOngoingQuest = 'NO_ONGOING_QUEST',
  InvalidFileNameExtension = 'FILE_NAME_EXTENSION',
  InvalidFilenameCharacters = 'FILE_NAME_CHARACTERS',

  // 401 (Unauthorized)
  MissingAuthToken = 'MISSING_AUTHENTICATION_TOKEN',
  InvalidAccessToken = 'INVLID_ACCESS_TOKEN',
  InvalidRefreshToken = 'INVALID_REFRESH_TOKEN',
  InvalidAddress = 'INVALID_ADDRESS',
  InvalidLoginInfo = 'INVALID_LOGIN_INFO',

  // 404 (Not Found)
  ContentNotFound = 'CONTENT_NOT_FOUND',

  // 409 (Confict)
  AlreadyExists = 'ALREADY_EXISTS',
  DuplicateValues = 'DUPLICATE_VALUE',
  LimitExceeded = 'LIMIT_EXCEEDED',

  // 500
  InternalServerError = 'INTERNAL_SERVER_ERROR',
}

// 에러코드, HTTP Status 매핑
export const CodeToStatus: {
  [key in ExceptionCode]: HttpStatus;
} = {
  [ExceptionCode.InvalidParameter]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.LimitExceeded]: HttpStatus.CONFLICT,
  [ExceptionCode.MissingAuthToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidAccessToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.ContentNotFound]: HttpStatus.NOT_FOUND,
  [ExceptionCode.AlreadyExists]: HttpStatus.CONFLICT,
  [ExceptionCode.DuplicateValues]: HttpStatus.CONFLICT,
  [ExceptionCode.InternalServerError]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ExceptionCode.InvalidAddress]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidLoginInfo]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.NoOngoingQuest]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidFileNameExtension]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidFilenameCharacters]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidRefreshToken]: HttpStatus.UNAUTHORIZED,
};
