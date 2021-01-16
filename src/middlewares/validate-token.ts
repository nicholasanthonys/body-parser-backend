import {Request,Response, NextFunction} from 'express';
import jsonwebtoken from 'jsonwebtoken';

//* middleware to validate token
const validateToken = (req: Request, res: Response, next : NextFunction) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        // Example : Bearer kdjdkaidkwkk(this is the token). Split by space
        const token = authHeader.split(' ')[1];
        try {
            const user = jsonwebtoken.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
            req.body.user = user;
            next(); // to continue the flow
          } catch (err) {
            res.status(403).json({ error: "Token is not valid" });
          }
    }else{
        return res.status(401).json({ error: "Access denied" });
    }

 
};

export default validateToken;