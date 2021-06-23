import { NextFunction, Request, Response } from "express";
import HttpException from "src/exceptions/HttpException";

const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status|| 500;
  const message = err.message || "Something went wrong";
  res.status(status).send({ message });
};

export default errorHandler;
