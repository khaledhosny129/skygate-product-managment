import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@core/exceptions/base.exception';
import { ExceptionError } from '@core/interfaces/exception-error.interface';

export class BadRequestException extends BaseException {

  constructor(message: string, error: ExceptionError) {

    super(
      message,
      error,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class UnauthorizedException extends BaseException {

  constructor(message: string, error: ExceptionError) {

    super(
      message,
      error,
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class ForbiddenException extends BaseException {

  constructor(message: string, error: ExceptionError) {

    super(
      message,
      error,
      HttpStatus.FORBIDDEN
    );
  }
}

export class NotFoundException extends BaseException {

  constructor(message: string, error: ExceptionError) {

    super(
      message,
      error,
      HttpStatus.NOT_FOUND
    );
  }
}

export class ConflictException extends BaseException {

  constructor(message: string, error: ExceptionError) {

    super(
      message,
      error,
      HttpStatus.CONFLICT
    );
  }
}
