import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import decodeToken from '../utils/decodeToken';

//* middleware to validate token
const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    //* Decode the json web token, usually contain user payload
    const decoded = decodeToken(req)
    if (decoded) {
      next(); // to continue the flow
    } else {
      return res.status(403).json({ error: "Token is not valid" });

    }

  } else {
    return res.status(401).json({ error: "Access denied" });

  };
};

export default validateToken;