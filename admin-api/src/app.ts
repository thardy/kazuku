import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import routes from './routes';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './common/errors/not-found-error';

const app = express();
// app.use(setupAuthZone);
app.use(json());
routes(app);

//app.use(authRouter);
app.all('*', async (req, res) => {
  console.log('inside not found path handler');
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log('kazuku-admin-api listening on port 3000!!!');
});


// ***** Shutdown Cleanup *****
const cleanup = (event: any) => { // SIGINT is sent for example when you Ctrl+C a running process from the command line.
  // clean stuff up here
  process.exit(); // Exit with default success-code '0'.
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
