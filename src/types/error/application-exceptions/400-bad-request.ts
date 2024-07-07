import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class NoOngoingQuestError extends ApplicationException {
  constructor() {
    super(ExceptionCode.NoOngoingQuest, 'No ongoing quest');
  }
}

export class InvalidFileNameExtensionError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidFileNameExtension,
      'Invalid Filename Extension. Only JPG, PNG, JPEG and GIF files are allowed.',
    );
  }
}

export class InvalidFileNameCharatersError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidFilenameCharacters,
      'File names can only contain English letters (a-z, A-Z), numbers (0-9), Korean characters, underscores (_), hyphens (-), and periods (.)',
    );
  }
}
