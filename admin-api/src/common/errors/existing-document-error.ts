import {CustomError} from './custom-error';

export class ExistingDocumentError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ExistingDocumentError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined; }[] {
    return [{ message: this.message }]
  }
}
