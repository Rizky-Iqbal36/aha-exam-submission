import { HttpException, HttpStatus } from '@nestjs/common';
import { EFlag } from '@src/interfaces/enum';
import { IMessageOption, IDetailException, IObject } from '@src/interfaces';

type TDetailException = Omit<IDetailException, 'flag'> & {
  reason?: string;
};

export class SuccessResponse extends HttpException {
  constructor(data: any) {
    super(data, HttpStatus.OK);
  }
}

export class CustomHttpException extends HttpException {
  public details: IDetailException;
  constructor(
    httpStatus: number,
    details: IDetailException,
    messageOption: IMessageOption
  ) {
    super('Internal Server Error', httpStatus);
    this.details = details;
    this.getMessage(messageOption);
  }

  private getMessage(messageOption: IMessageOption) {
    if (messageOption.message) super.message = messageOption.message;
    else if (messageOption.localeMessage)
      super.message = messageOption.localeMessage.key;
  }
}

// Exception with custom flag and message
export class TooManyRequest extends CustomHttpException {
  constructor(details: IDetailException, messageOption: IMessageOption) {
    super(HttpStatus.TOO_MANY_REQUESTS, details, messageOption);
  }
}

export class NotFound extends CustomHttpException {
  constructor(details: IDetailException, messageOption: IMessageOption) {
    super(HttpStatus.NOT_FOUND, details, messageOption);
  }
}
export class BadRequest extends CustomHttpException {
  constructor(details: IDetailException, messageOption: IMessageOption) {
    super(HttpStatus.BAD_REQUEST, details, messageOption);
  }
}

export class Gone extends CustomHttpException {
  constructor(details: IDetailException, messageOption: IMessageOption) {
    super(HttpStatus.GONE, details, messageOption);
  }
}

export class UnsupportedMediaType extends CustomHttpException {
  constructor(details: IDetailException, messageOption: IMessageOption) {
    super(HttpStatus.UNSUPPORTED_MEDIA_TYPE, details, messageOption);
  }
}

// Exception with constant flag and message
export class InternalServerError extends CustomHttpException {
  constructor(details: TDetailException) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      { flag: EFlag.INTERNAL_SERVER_ERROR, ...details },
      { localeMessage: { key: 'INTERNAL_SERVER_ERROR' } }
    );
  }
}

export class PayloadTooLarge extends CustomHttpException {
  constructor(details: TDetailException) {
    super(
      HttpStatus.PAYLOAD_TOO_LARGE,
      { flag: EFlag.PAYLOAD_TOO_LARGE, ...details },
      { localeMessage: { key: 'PAYLOAD_TOO_LARGE' } }
    );
  }
}

export class MethodNotAllowed extends CustomHttpException {
  constructor(details: TDetailException) {
    super(
      HttpStatus.METHOD_NOT_ALLOWED,
      { flag: EFlag.METHOD_NOT_ALLOWED, ...details },
      { localeMessage: { key: 'METHOD_NOT_ALLOWED' } }
    );
  }
}

export class Forbidden extends CustomHttpException {
  constructor(details: TDetailException) {
    super(
      HttpStatus.FORBIDDEN,
      { flag: EFlag.FORBIDDEN, ...details },
      { localeMessage: { key: 'FORBIDDEN' } }
    );
  }
}

export class Unauthorized extends CustomHttpException {
  constructor(details: TDetailException) {
    super(
      HttpStatus.UNAUTHORIZED,
      { flag: EFlag.UNAUTHORIZED, ...details },
      { localeMessage: { key: 'UNAUTHORIZED' } }
    );
  }
}

export class SuperError extends Error {
  public attributes: IObject;
  constructor(message: string, attributes: IObject) {
    super(message);
    this.attributes = attributes;
  }
}
