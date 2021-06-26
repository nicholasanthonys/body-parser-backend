import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import {connectToMongo} from './database/connect';
//* Cors Middleware
import cors from 'cors';

//* Custom middleware
import validateToken from './middlewares/validate-token';

//* Import route
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import userRoute from './routes/user';
import projectRoute from './routes/projects';
import configureRoute from './routes/configures';
import containerRoute from './routes/container';
import imageRouter from './routes/image';
import errorHandler from './middlewares/error-handler';

//* load environment variable
dotenv.config();

//* Get Port from env
const port = process.env.PORT || 5000

//* Read MONGO URI from .env


//* connect to mongodb
connectToMongo();

const app: Application = express();

//* middleware body parser
app.use(express.json());

//* middleware cors
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

const prefixRoute = '/api/v1';

//* Login, Register and get Token route
app.use(`${prefixRoute}/auth`, authRoutes);
app.use(`${prefixRoute}/image`, imageRouter);

//* This route below is protected by Middleware that verify JWT Token
app.use(validateToken);

//* this route is protected with token
app.use(`${prefixRoute}/dashboard`, dashboardRoutes);
app.use(`${prefixRoute}/user`, userRoute);
app.use(`${prefixRoute}/project`, projectRoute);
app.use(`${prefixRoute}/configure`, configureRoute);
app.use(`${prefixRoute}/container`, containerRoute);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(errorHandler)
