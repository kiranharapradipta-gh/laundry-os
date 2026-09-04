import { Router } from "express";

import {
  getOrderByQr,
  pickupOrderByQr,
  scanOrderQr,
} from "../controllers/qr.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/order/:token",
  getOrderByQr
);

router.post(
  "/order/:token/pickup",
  authMiddleware,
  pickupOrderByQr
);

router.get(
  "/order/:token/scan",
  authMiddleware,
  scanOrderQr
);

export default router;