import {CustomError} from './custom.error';

export class IdNotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Id not found');

    // Only needed because we are extending a built-in class
    Object.setPrototypeOf(this, IdNotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined; }[] {
    return [{ message: 'Id not found' }];
  }
}
