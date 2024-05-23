import {CustomError} from './custom.error';

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
      super('Route not found');

      // Only needed because we are extending a built-in class
      Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: 'Not Found' }];
    }
}
