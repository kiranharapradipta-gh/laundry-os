import { Router } from "express";

import {
  create,
  list,
  remove,
} from "../controllers/item-photo.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  uploadItemPhoto,
} from "../middleware/upload.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/orders/:orderId/items/:itemId/photos",
  list
);

router.post(
  "/orders/:orderId/items/:itemId/photos",
  uploadItemPhoto.single("file"),
  create
);

router.delete(
  "/orders/:orderId/items/:itemId/photos/:photoId",
  remove
);

export default router;

// import { Router } from "express";

// import {
//   create,
//   list,
//   remove,
// } from "../controllers/item-photo.controller.js";

// import {
//   authMiddleware,
// } from "../middleware/auth.middleware.js";

// const router = Router();

// router.use(authMiddleware);

// router.get(
//   "/orders/:orderId/items/:itemId/photos",
//   list
// );

// router.post(
//   "/orders/:orderId/items/:itemId/photos",
//   create
// );

// router.delete(
//   "/orders/:orderId/items/:itemId/photos/:photoId",
//   remove
// );

// export default router;