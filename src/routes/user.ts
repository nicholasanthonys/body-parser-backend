import { Router } from 'express';
import { Request, Response } from 'express';
import decodeToken from '../utils/decodeToken';


const router = Router();
// Register route
router.get("/", async (req: Request, res: Response) => {
    //* decode jwt token and return payload (payload is user)
    const decoded = decodeToken(req)
    if (decoded) {
        return res.status(200).send({user : decoded}) // to continue the flow
    } else {
        return res.status(403).json({ error: "Token is not valid" });

    }
});

export default router
