import { Router } from "express";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  sendTestMessage,
} from "../controllers/whatsapp.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/test",
  sendTestMessage
);

export default router;