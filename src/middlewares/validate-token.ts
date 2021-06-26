import { Request, Response, NextFunction } from "express";
import HttpException from "src/exceptions/HttpException";
import decodeToken from "../utils/decodeToken";

//* middleware to validate token
const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    //* Decode the json web token, usually contain user payload
    const decoded = decodeToken(req);
    if (decoded) {
      next(); // to continue the flow
    } else {
      return next(new HttpException(403, "Token is not valid"));
    }
  } else {
    return next(new HttpException(401, "Access denied"));
  }
};

export default validateToken;
