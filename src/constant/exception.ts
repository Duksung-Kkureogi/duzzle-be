import { HttpStatus } from '@nestjs/common';

// 내부 에러 코드, HTTP 응답 코드 겸용
export enum ExceptionCode {
  // 400 (Bad Request)
  InvalidParameter = 'INVALID_PARAMETER',
  RowLimitExceeded = 'ROW_LIMIT_EXCEEDED',
  InvalidDate = 'INVALID_DATE',

  // 401 (Unauthorized)
  MissingAuthToken = 'MISSING_AUTHENTICATION_TOKEN',
  InvalidAccessToken = 'INVLID_ACCESS_TOKEN',
  TokenExpired = 'TOKEN_EXPIRED',

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
  [ExceptionCode.RowLimitExceeded]:
    'Exceeded the maximum download row count 10,000',

  // 401 (Unauthorized)
  // token is null/undefined
  [ExceptionCode.MissingAuthToken]:
    'Access token is missing in the request header.',

  [ExceptionCode.InvalidAccessToken]: 'Invalid Access Token',

  // jwt verify fail
  [ExceptionCode.TokenExpired]: 'Token expired',

  // 404 (Not Found)
  [ExceptionCode.NotFound]: 'Page Not Found',

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
  [ExceptionCode.RowLimitExceeded]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.MissingAuthToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidAccessToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.TokenExpired]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.NotFound]: HttpStatus.NOT_FOUND,
  [ExceptionCode.AlreadyExists]: HttpStatus.CONFLICT,
  [ExceptionCode.AlreadyBlocked]: HttpStatus.CONFLICT,
  [ExceptionCode.DuplicateValues]: HttpStatus.CONFLICT,
  [ExceptionCode.InternalServerError]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ExceptionCode.InvalidDate]: HttpStatus.BAD_REQUEST,
};
