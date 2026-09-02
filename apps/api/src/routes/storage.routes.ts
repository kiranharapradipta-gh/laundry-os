import { Router } from "express";

import {
  listStorageLocations,
  getStorageLocation,
  create,
  update,
} from "../controllers/storage.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listStorageLocations);
router.get("/:id", getStorageLocation);
router.post("/", create);
router.put("/:id", update);

export default router;