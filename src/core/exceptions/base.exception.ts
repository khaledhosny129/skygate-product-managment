import { ExceptionError } from '@core/interfaces/exception-error.interface';

export class BaseException extends Error {

  error: ExceptionError;
  code : number;

  constructor(message: string, error: ExceptionError, code: number) {

    super(message);

    this.name = this.constructor.name;
    this.error = error;
    this.code = code;
  }
}