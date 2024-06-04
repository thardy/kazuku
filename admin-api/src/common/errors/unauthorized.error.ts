import {CustomError} from './custom.error';

export class UnauthorizedError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Unauthorized');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Unauthorized' }];
  }
}
