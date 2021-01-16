
//* This is example of protected route
import {Request, Response,Router} from 'express';
const router = Router();
router.get("/", (req : Request, res:Response) => {
  res.json({
    error: null,
    data: {
      title: "My dashboard",
      content: "dashboard content",
      user: req.body.user, // token payload information
    },
  });
});
export default router