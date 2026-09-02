import { Router } from "express";
import { getOrderByQr, pickupOrderByQr, } from "../controllers/qr.controller.js";
import { authMiddleware, } from "../middleware/auth.middleware.js";
const router = Router();
router.get("/order/:token", getOrderByQr);
router.post("/order/:token/pickup", authMiddleware, pickupOrderByQr);
export default router;
//# sourceMappingURL=qr.routes.js.map