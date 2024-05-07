import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
//import mongoose from 'mongoose';

import routes from './routes';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './common/errors/not-found-error';

const app = express();

function setupExpress() {
  app.use(json());
  routes(app);

  app.all('*', async (req, res) => {
    throw new NotFoundError();
  });
  app.use(errorHandler);
}

export { app, setupExpress };
