import { Router } from "express";
import { create, list, get, updateStatus, } from "../controllers/order.controller.js";
import { authMiddleware, } from "../middleware/auth.middleware.js";
const router = Router();
router.use(authMiddleware);
router.get("/", list);
router.get("/:id", get);
router.post("/", create);
router.put("/:id/status", updateStatus);
export default router;
//# sourceMappingURL=order.routes.js.map