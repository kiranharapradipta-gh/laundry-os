import { Router } from "express";

import {
  listCustomers,
  getCustomer,
  create,
  update,
} from "../controllers/customer.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listCustomers);

router.get("/:id", getCustomer);

router.post("/", create);

router.put("/:id", update);

export default router;