import { Request, Response, NextFunction } from 'express';
import {CustomError} from '#common/errors/custom.error';

// this is used as an error handler by express because we accept all five parameters in our handler
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    console.log(err.message);
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: err.message }]
  });
};

