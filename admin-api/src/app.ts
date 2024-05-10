import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
//import passport from 'passport';

//import * as passportConfig from './server/passport';
import routes from './server/routes';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './common/errors/not-found-error';

const app = express();

function setupExpress() {
  app.use(json());
  //app.use(passport.initialize());
  routes(app);

  app.all('*', async (req, res) => {
    throw new NotFoundError();
  });
  app.use(errorHandler);
}

export { app, setupExpress };
