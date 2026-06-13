import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import * as validation from "../middleware/validation.js";

const router = Router();

router.get("/", userController.getUsers);
router.patch("/block", validation.BlockUsers, userController.blockUsers);
router.delete("/", validation.DeleteUsers, userController.deleteUsers);
router.delete("/unverified", validation.DeleteUsers, userController.deleteUnverifiedUsers);

export default router;