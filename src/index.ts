import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';

//* Cors Middleware
import cors from 'cors';

//* Custom middleware
import validateToken from './middlewares/validate-token';

//* Import route
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import userRoute from './routes/user';

dotenv.config();

//* Get Port from env
const port = process.env.PORT || 5000

//* Read MONGO URI from .env
const DB_CONNECT = process.env.DB_CONNECT;

//* connect to mongodb
mongoose.connect(
  `${DB_CONNECT}`, // Use template string otherwise this will be error
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to db")
);


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


//* This route below is protected by Middleware that verify JWT Token
app.use(validateToken);

//* this route is protected with token
 app.use(`${prefixRoute}/dashboard`, dashboardRoutes);
app.use(`${prefixRoute}/user`, userRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
