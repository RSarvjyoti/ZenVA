import {Router} from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import isAuth from "../middleweres/isAuth.js";
import upload from "../middleweres/multer.js";

const userRoute = Router();

userRoute.get("/current", isAuth , getCurrentUser);
userRoute.post('/update-assistant', isAuth, upload.single("assistantImage"), updateAssistant);
userRoute.post('/ask-to-assitant', isAuth, askToAssistant);

export default userRoute;