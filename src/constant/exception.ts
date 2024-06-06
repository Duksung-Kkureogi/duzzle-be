import { HttpStatus } from '@nestjs/common';

// 내부 에러 코드, HTTP 응답 코드 겸용
export enum ExceptionCode {
  // 400 (Bad Request)
  InvalidParameter = 'INVALID_PARAMETER',
  LimitExceeded = 'LIMIT_EXCEEDED',
  InvalidDate = 'INVALID_DATE',
  NoOngoingQuest = 'NO_ONGOING_QUEST',
  InvalidFileNameExtension = 'FILE_NAME_EXTENSION',
  InvalidFilenameCharacters = 'FILE_NAME_CHARACTERS',

  // 401 (Unauthorized)
  MissingAuthToken = 'MISSING_AUTHENTICATION_TOKEN',
  InvalidAccessToken = 'INVLID_ACCESS_TOKEN',
  TokenExpired = 'TOKEN_EXPIRED',
  InvalidAddress = 'INVALID_ADDRESS',
  InvalidLoginInfo = 'INVALID_LOGIN_INFO',

  // 403 (FORBIDDEN)
  Forbidden = 'FORBIDDEN',

  // 404 (Not Found)
  NotFound = 'NOT_FOUND',

  // 409 (Confict)
  AlreadyExists = 'ALREADY_EXISTS',
  AlreadyBlocked = 'ALREADY_BLOCKED',
  DuplicateValues = 'DUPLICATE_VALUE',

  // 500
  InternalServerError = 'INTERNAL_SERVER_ERROR',
}

// HTTP 응답 메시지
export const ExceptionMessage: {
  [key in ExceptionCode]?: string;
} = {
  // 400 (Bad Request)
  [ExceptionCode.InvalidParameter]: 'Invalid Parameter',
  [ExceptionCode.LimitExceeded]: 'Limit Exceeded',
  [ExceptionCode.InvalidFileNameExtension]: '지원되지 않는 파일 형식입니다.',
  [ExceptionCode.InvalidFilenameCharacters]:
    '파일명에 특수문자를 포함할 수 없습니다.',

  // 401 (Unauthorized)
  // token is null/undefined
  [ExceptionCode.MissingAuthToken]:
    'Access token is missing in the request header.',

  [ExceptionCode.InvalidAccessToken]: 'Invalid Access Token',
  [ExceptionCode.InvalidAddress]: 'Wallet Address Different',

  // jwt verify fail
  [ExceptionCode.TokenExpired]: 'Token expired',

  // 404 (Not Found)
  [ExceptionCode.NotFound]: 'Content Not Found',

  // 409 (Confict)
  [ExceptionCode.AlreadyExists]: 'Same value already exists',
  [ExceptionCode.AlreadyBlocked]: 'Already blocked user',
  [ExceptionCode.DuplicateValues]: 'Duplicate values',

  // 500
  [ExceptionCode.InternalServerError]: 'Internal server error',
};

// 에러코드, HTTP Status 매핑
export const CodeToStatus: {
  [key in ExceptionCode]: HttpStatus;
} = {
  [ExceptionCode.InvalidParameter]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.LimitExceeded]: HttpStatus.CONFLICT,
  [ExceptionCode.MissingAuthToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidAccessToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.TokenExpired]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.Forbidden]: HttpStatus.FORBIDDEN,
  [ExceptionCode.NotFound]: HttpStatus.NOT_FOUND,
  [ExceptionCode.AlreadyExists]: HttpStatus.CONFLICT,
  [ExceptionCode.AlreadyBlocked]: HttpStatus.CONFLICT,
  [ExceptionCode.DuplicateValues]: HttpStatus.CONFLICT,
  [ExceptionCode.InternalServerError]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ExceptionCode.InvalidDate]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidAddress]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidLoginInfo]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.NoOngoingQuest]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidFileNameExtension]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidFilenameCharacters]: HttpStatus.BAD_REQUEST,
};
