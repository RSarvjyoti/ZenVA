import {Router} from "express";
import { login, signup } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', login);

export default authRouter;