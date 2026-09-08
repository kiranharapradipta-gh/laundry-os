import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  changePasswordController,
  getSettingsController,
  updateBusinessController,
  updateProfileController,
} from "../controllers/settings.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getSettingsController);

router.patch("/profile", updateProfileController);

router.patch("/business", updateBusinessController);

router.patch("/password", changePasswordController);

export default router;