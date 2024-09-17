import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import httpContext from 'express-http-context';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/UserController';
import { PostController } from './controllers/PostController';
import 'reflect-metadata';
import { GlobalErrorHandler } from './middlewares/globalErrorHandler';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../src/swagger/openapi.json';



dotenv.config();

const port = process.env.PORT;
const app: Express = express();

mongoose
  .connect('mongodb://localhost:27017/tstest')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));
//

app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
  controllers: [UserController, PostController],
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port || 3000, () => {
  console.log(`Server running on ${port}`);
});
