import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';

//* Import route
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import validateToken from './middlewares/validate-token';


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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

//* Login, Register and get Token route
app.use("/api/v1/auth", authRoutes);


//* This route below is protected by Middleware that verify JWT Token
app.use(validateToken);

//* this route is protected with token
app.use("/api/v1/dashboard", dashboardRoutes);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
