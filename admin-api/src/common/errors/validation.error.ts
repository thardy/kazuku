import {CustomError} from './custom.error';
import Joi from 'joi';

export class ValidationError extends CustomError {
  statusCode = 400;

  constructor(public validationError: Joi.ValidationError) {
    // call super with message
    super(validationError?.details[0]?.message);
    // set prototype
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined; }[] {
    return this.validationError.details.map((errorDetail) => {
      let error = { message: errorDetail.message, field: errorDetail.path.toString() };
      return error;
    });
  }
}

// example Joi.ValidationError with 2 errors...
// {
//   "value": {
//   "email": "yourmom",
//     "password": "te",
//     "orgId": "999"
//   },
//   "error": {
//   "_original": {
//     "email": "yourmom",
//       "password": "te",
//       "orgId": "999"
//   },
//   "details": [
//     {
//       "message": "\"email\" must be a valid email",
//       "path": [
//         "email"
//       ],
//       "type": "string.email",
//       "context": {
//         "value": "yourmom",
//         "invalids": [
//           "yourmom"
//         ],
//         "label": "email",
//         "key": "email"
//       }
//     },
//     {
//       "message": "\"password\" length must be at least 4 characters long",
//       "path": [
//         "password"
//       ],
//       "type": "string.min",
//       "context": {
//         "limit": 4,
//         "value": "te",
//         "label": "password",
//         "key": "password"
//       }
//     }
//   ]
// }
