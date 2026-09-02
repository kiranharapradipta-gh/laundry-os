import type { Request, Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/order.service.js";

// ========================================
// CREATE ORDER
// ========================================

export async function create(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Tidak terautentikasi",
      });
    }

    const {
      customerId,
      storageLocationId,
      discount,
      items,
    } = req.body;

    // ======================================
    // BASIC VALIDATION
    // ======================================

    if (
      typeof customerId !== "string" ||
      !customerId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer ID wajib diisi",
      });
    }

    if (
      storageLocationId !== undefined &&
      storageLocationId !== null &&
      typeof storageLocationId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Storage location ID tidak valid",
      });
    }

    if (
      discount !== undefined &&
      discount !== null &&
      (
        typeof discount !== "number" ||
        !Number.isFinite(discount) ||
        discount < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount tidak valid",
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order harus memiliki minimal satu item",
      });
    }

    // ======================================
    // ITEM VALIDATION
    // ======================================

    for (const item of items) {
      if (
        typeof item !== "object" ||
        item === null
      ) {
        return res.status(400).json({
          success: false,
          message: "Format item tidak valid",
        });
      }

      if (
        typeof item.serviceId !== "string" ||
        !item.serviceId.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Service ID pada item wajib diisi",
        });
      }

      if (
        typeof item.description !== "string" ||
        !item.description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Deskripsi item wajib diisi",
        });
      }

      if (
        item.quantity !== undefined &&
        (
          typeof item.quantity !== "number" ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity harus berupa angka bulat lebih dari 0",
        });
      }

      if (
        item.weight !== undefined &&
        item.weight !== null &&
        (
          typeof item.weight !== "number" ||
          !Number.isFinite(item.weight) ||
          item.weight <= 0
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Weight harus berupa angka lebih dari 0",
        });
      }
    }

    // ======================================
    // CREATE
    // ======================================

    const order = await createOrder(
      req.user.businessId,
      req.user.userId,
      {
        customerId: customerId.trim(),

        ...(storageLocationId && {
          storageLocationId:
            storageLocationId.trim(),
        }),

        ...(discount !== undefined && {
          discount,
        }),

        items: items.map((item) => ({
          serviceId:
            item.serviceId.trim(),

          description: item.description.trim(),

          ...(item.quantity !== undefined && {
            quantity: item.quantity,
          }),

          ...(item.weight !== undefined &&
            item.weight !== null && {
              weight: item.weight,
            }),

          ...(typeof item.condition === "string" && {
            condition:
              item.condition.trim(),
          }),

          ...(typeof item.notes === "string" && {
            notes:
              item.notes.trim(),
          }),
        })),
      }
    );

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat order",
    });
  }
}

export async function list(
  req: AuthRequest,
  res: Response
) {
  try {
    const orders = await getOrders(
      req.user!.businessId
    );

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("List orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data order",
    });
  }
}

export async function get(
  req: AuthRequest,
  res: Response
) {
  try {
    const orderId = req.params.id;

    if (typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID order tidak valid",
      });
    }

    const order = await getOrderById(
      req.user!.businessId,
      orderId
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data order",
    });
  }
}

export async function updateStatus(
  req: AuthRequest,
  res: Response
) {
  try {
    const orderId = req.params.id;

    if (typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID order tidak valid",
      });
    }

    const { status, note } = req.body;

    const validStatuses = [
      "RECEIVED",
      "WASHING",
      "DRYING",
      "IRONING",
      "READY",
      "PICKED_UP",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status order tidak valid",
      });
    }

    const order = await updateOrderStatus(
      req.user!.businessId,
      orderId,
      req.user!.userId,
      {
        status,
        note,
      }
    );

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengubah status order";

    if (
      message.includes("Status tidak dapat diubah")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gagal mengubah status order",
    });
  }
}