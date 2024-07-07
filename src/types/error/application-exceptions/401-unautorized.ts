import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class MissingAuthTokenError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.MissingAuthToken,
      'Access token is missing in the request header.',
    );
  }
}

export class InvalidAccessTokenError extends ApplicationException {
  constructor() {
    super(ExceptionCode.InvalidAccessToken, 'Invalid Access Token');
  }
}

export class InvalidatedRefreshTokenError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidRefreshToken,
      'Access denied. Your refresh token might have been stolen',
    );
  }
}

export class IncorrectLoginInfo extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidLoginInfo,
      'The email address or password is invalid',
    );
  }
}

export class InvalidWalletAddress extends ApplicationException {
  constructor() {
    super(ExceptionCode.InvalidAddress, 'Wallet Address Different');
  }
}
