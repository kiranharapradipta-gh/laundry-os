import { Router } from "express";

import {
  listServices,
  getService,
  create,
  update,
} from "../controllers/service.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listServices);

router.get("/:id", getService);

router.post("/", create);

router.put("/:id", update);

export default router;