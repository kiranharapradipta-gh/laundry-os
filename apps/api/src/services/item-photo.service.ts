import crypto from "node:crypto";
import path from "node:path";

import { prisma } from "../config/database.js";
import {
  uploadFile,
  deleteFile,
  createSignedUrl,
} from "./file-storage.service.js";

interface CreateItemPhotoInput {
  file: Buffer;
  contentType: string;
  originalName: string;
}

async function getOrderItemForBusiness(
  businessId: string,
  orderId: string,
  orderItemId: string
) {
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
      orderId,
      order: {
        businessId,
      },
    },
  });

  if (!orderItem) {
    throw new Error("Item order tidak ditemukan");
  }

  return orderItem;
}

function getExtension(
  contentType: string,
  originalName: string
) {
  const extensionMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const mappedExtension = extensionMap[contentType];

  if (mappedExtension) {
    return mappedExtension;
  }

  return path.extname(originalName).toLowerCase() || ".jpg";
}

export async function createItemPhoto(
  businessId: string,
  orderId: string,
  orderItemId: string,
  input: CreateItemPhotoInput
) {
  const orderItem = await getOrderItemForBusiness(
    businessId,
    orderId,
    orderItemId
  );

  if (!input.file || input.file.length === 0) {
    throw new Error("File foto wajib diisi");
  }

  const extension = getExtension(
    input.contentType,
    input.originalName
  );

  const randomId = crypto.randomUUID();

  const storageKey =
    `businesses/${businessId}` +
    `/orders/${orderId}` +
    `/items/${orderItem.id}` +
    `/${randomId}${extension}`;

  await uploadFile(
    input.file,
    storageKey,
    input.contentType
  );

  try {
    const photo = await prisma.itemPhoto.create({
      data: {
        orderItemId: orderItem.id,

        // Untuk sekarang kita simpan storage key
        // sebagai referensi internal.
        url: storageKey,

        storageKey,
      },
    });

    return photo;
  } catch (error) {
    // Kalau database gagal setelah upload,
    // hapus file supaya tidak jadi orphan.
    try {
      await deleteFile(storageKey);
    } catch (cleanupError) {
      console.error(
        "Gagal cleanup file Supabase:",
        cleanupError
      );
    }

    throw error;
  }
}

export async function getItemPhotos(
  businessId: string,
  orderId: string,
  orderItemId: string
) {
  await getOrderItemForBusiness(
    businessId,
    orderId,
    orderItemId
  );

  const photos = await prisma.itemPhoto.findMany({
    where: {
      orderItemId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const result = await Promise.all(
    photos.map(async (photo) => {
      if (!photo.storageKey) {
        return photo;
      }

      const signedUrl = await createSignedUrl(
        photo.storageKey,
        60 * 15
      );

      return {
        ...photo,
        url: signedUrl,
      };
    })
  );

  return result;
}

export async function deleteItemPhoto(
  businessId: string,
  orderId: string,
  orderItemId: string,
  photoId: string
) {
  await getOrderItemForBusiness(
    businessId,
    orderId,
    orderItemId
  );

  const photo = await prisma.itemPhoto.findFirst({
    where: {
      id: photoId,
      orderItemId,
    },
  });

  if (!photo) {
    throw new Error("Foto item tidak ditemukan");
  }

  if (photo.storageKey) {
    await deleteFile(photo.storageKey);
  }

  return prisma.itemPhoto.delete({
    where: {
      id: photo.id,
    },
  });
}

// import { prisma } from "../config/database.js";

// interface CreateItemPhotoInput {
//   url: string;
//   storageKey?: string;
// }

// async function getOrderItemForBusiness(
//   businessId: string,
//   orderId: string,
//   orderItemId: string
// ) {
//   const orderItem = await prisma.orderItem.findFirst({
//     where: {
//       id: orderItemId,
//       orderId,
//       order: {
//         businessId,
//       },
//     },
//   });

//   if (!orderItem) {
//     throw new Error("Item order tidak ditemukan");
//   }

//   return orderItem;
// }

// export async function createItemPhoto(
//   businessId: string,
//   orderId: string,
//   orderItemId: string,
//   input: CreateItemPhotoInput
// ) {
//   const orderItem = await getOrderItemForBusiness(
//     businessId,
//     orderId,
//     orderItemId
//   );

//   if (!input.url.trim()) {
//     throw new Error("URL foto wajib diisi");
//   }

//   return prisma.itemPhoto.create({
//     data: {
//       orderItemId: orderItem.id,
//       url: input.url.trim(),
//       storageKey: input.storageKey?.trim() || null,
//     },
//   });
// }

// export async function getItemPhotos(
//   businessId: string,
//   orderId: string,
//   orderItemId: string
// ) {
//   await getOrderItemForBusiness(
//     businessId,
//     orderId,
//     orderItemId
//   );

//   return prisma.itemPhoto.findMany({
//     where: {
//       orderItemId,
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//   });
// }

// export async function deleteItemPhoto(
//   businessId: string,
//   orderId: string,
//   orderItemId: string,
//   photoId: string
// ) {
//   await getOrderItemForBusiness(
//     businessId,
//     orderId,
//     orderItemId
//   );

//   const photo = await prisma.itemPhoto.findFirst({
//     where: {
//       id: photoId,
//       orderItemId,
//     },
//   });

//   if (!photo) {
//     throw new Error("Foto item tidak ditemukan");
//   }

//   return prisma.itemPhoto.delete({
//     where: {
//       id: photo.id,
//     },
//   });
// }