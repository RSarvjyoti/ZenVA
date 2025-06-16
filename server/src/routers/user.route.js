import {Router} from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middleweres/isAuth.js";

const userRoute = Router();

userRoute.get("/current", isAuth , getCurrentUser)

export default userRoute;