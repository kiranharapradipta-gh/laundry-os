import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createItemPhoto,
  getItemPhotos,
  deleteItemPhoto,
} from "../services/item-photo.service.js";

export async function create(
  req: AuthRequest,
  res: Response
) {
  try {
    const businessId = req.user!.businessId;

    const { orderId, itemId } = req.params;

    if (
      typeof orderId !== "string" ||
      typeof itemId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Parameter orderId atau itemId tidak valid",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Foto wajib diupload",
      });
    }

    const photo = await createItemPhoto(
      businessId,
      orderId,
      itemId,
      {
        file: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
      }
    );

    return res.status(201).json({
      success: true,
      data: photo,
    });
  } catch (error) {
    console.error(
      "Create item photo error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal upload foto",
    });
  }
}

export async function list(
  req: AuthRequest,
  res: Response
) {
  try {
    const businessId = req.user!.businessId;

    const { orderId, itemId } = req.params;

    if (
      typeof orderId !== "string" ||
      typeof itemId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Parameter orderId atau itemId tidak valid",
      });
    }

    const photos = await getItemPhotos(
      businessId,
      orderId,
      itemId
    );

    return res.json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error(
      "Get item photos error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengambil foto",
    });
  }
}

export async function remove(
  req: AuthRequest,
  res: Response
) {
  try {
    const businessId = req.user!.businessId;

    const {
      orderId,
      itemId,
      photoId,
    } = req.params;

    if (
      typeof orderId !== "string" ||
      typeof itemId !== "string" ||
      typeof photoId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Parameter foto tidak valid",
      });
    }

    await deleteItemPhoto(
      businessId,
      orderId,
      itemId,
      photoId
    );

    return res.json({
      success: true,
      message: "Foto berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "Delete item photo error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal menghapus foto",
    });
  }
}

// import type { Response } from "express";

// import type {
//   AuthRequest,
// } from "../middleware/auth.middleware.js";

// import {
//   createItemPhoto,
//   getItemPhotos,
//   deleteItemPhoto,
// } from "../services/item-photo.service.js";

// export async function create(
//   req: AuthRequest,
//   res: Response
// ) {
//   try {
//     const orderId = req.params.orderId;
//     const orderItemId = req.params.itemId;

//     if (
//       typeof orderId !== "string" ||
//       typeof orderItemId !== "string"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "ID order atau item tidak valid",
//       });
//     }

//     const { url, storageKey } = req.body;

//     if (
//       typeof url !== "string" ||
//       !url.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "URL foto wajib diisi",
//       });
//     }

//     const photo = await createItemPhoto(
//       req.user!.businessId,
//       orderId,
//       orderItemId,
//       {
//         url,
//         storageKey,
//       }
//     );

//     return res.status(201).json({
//       success: true,
//       data: photo,
//     });
//   } catch (error) {
//     console.error(
//       "Create item photo error:",
//       error
//     );

//     const message =
//       error instanceof Error
//         ? error.message
//         : "Gagal menambahkan foto";

//     if (
//       message.includes("Item order tidak ditemukan") ||
//       message.includes("URL foto wajib")
//     ) {
//       return res.status(400).json({
//         success: false,
//         message,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Gagal menambahkan foto",
//     });
//   }
// }

// export async function list(
//   req: AuthRequest,
//   res: Response
// ) {
//   try {
//     const orderId = req.params.orderId;
//     const orderItemId = req.params.itemId;

//     if (
//       typeof orderId !== "string" ||
//       typeof orderItemId !== "string"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "ID order atau item tidak valid",
//       });
//     }

//     const photos = await getItemPhotos(
//       req.user!.businessId,
//       orderId,
//       orderItemId
//     );

//     return res.json({
//       success: true,
//       data: photos,
//     });
//   } catch (error) {
//     console.error(
//       "Get item photos error:",
//       error
//     );

//     const message =
//       error instanceof Error
//         ? error.message
//         : "Gagal mengambil foto";

//     if (
//       message.includes("Item order tidak ditemukan")
//     ) {
//       return res.status(404).json({
//         success: false,
//         message,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Gagal mengambil foto",
//     });
//   }
// }

// export async function remove(
//   req: AuthRequest,
//   res: Response
// ) {
//   try {
//     const orderId = req.params.orderId;
//     const orderItemId = req.params.itemId;
//     const photoId = req.params.photoId;

//     if (
//       typeof orderId !== "string" ||
//       typeof orderItemId !== "string" ||
//       typeof photoId !== "string"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "ID tidak valid",
//       });
//     }

//     await deleteItemPhoto(
//       req.user!.businessId,
//       orderId,
//       orderItemId,
//       photoId
//     );

//     return res.json({
//       success: true,
//       message: "Foto berhasil dihapus",
//     });
//   } catch (error) {
//     console.error(
//       "Delete item photo error:",
//       error
//     );

//     const message =
//       error instanceof Error
//         ? error.message
//         : "Gagal menghapus foto";

//     if (
//       message.includes("Item order tidak ditemukan") ||
//       message.includes("Foto item tidak ditemukan")
//     ) {
//       return res.status(404).json({
//         success: false,
//         message,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Gagal menghapus foto",
//     });
//   }
// }