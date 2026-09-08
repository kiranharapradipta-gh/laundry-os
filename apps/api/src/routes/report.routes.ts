import { Router } from "express";

import {
  summary,
} from "../controllers/report.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/summary",
  summary,
);

export default router;