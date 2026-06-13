import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";
import * as validation from "../middleware/validation.js";

const router = Router();

router.post("/register", validation.RegisterUser, authController.register);
router.get("/verify/:token", authController.verifyEmail);
router.post("/login", validation.LoginUser, authController.login)


export default router;