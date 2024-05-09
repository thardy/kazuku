// import { ValidationError } from 'express-validator';
// import {CustomError} from './custom-error';
//
// export class RequestValidationError extends CustomError {
//   statusCode = 400;
//
//   constructor(public errors: ValidationError[]) {
//     super('Invalid request parameters');
//
//     // Only needed because we are extending a built-in class
//     Object.setPrototypeOf(this, RequestValidationError.prototype);
//   }
//
//   serializeErrors() {
//     return this.errors.map((err) => {
//       let error = null;
//       if (err.type === 'field') {
//         error = { message: err.msg, field: err.path };
//       }
//       else {
//         error = { message: err.msg };
//       }
//       return error;
//     });
//   }
// }
