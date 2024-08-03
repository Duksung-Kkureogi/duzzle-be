import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class ProfileAccessDenied extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.ProfileAccessDenied,
      'Profile access permission is denied',
    );
  }
}
