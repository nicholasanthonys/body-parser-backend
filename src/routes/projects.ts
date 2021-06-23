import {  Router } from "express";
import IndexProject from './projects/IndexProject'

const router = Router();
router.use('/', IndexProject);

export default router;
