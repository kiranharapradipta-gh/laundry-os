import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  getOrderByQrToken,
  pickupOrderByQrToken,
  scanOrderQrToken,
} from "../services/qr.service.js";

export async function getOrderByQr(
  req: Request,
  res: Response
) {
  try {
    const token = req.params.token;

    if (typeof token !== "string" || !token.trim()) {
      return res.status(400).json({
        success: false,
        message: "QR token tidak valid",
      });
    }

    const order = await getOrderByQrToken(
      token.trim()
    );

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by QR error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "QR order tidak ditemukan";

    if (
      message.includes("QR order tidak ditemukan")
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gagal membaca QR order",
    });
  }
}

export async function pickupOrderByQr(
  req: AuthRequest,
  res: Response
) {
  try {
    const token = req.params.token;

    if (
      typeof token !== "string" ||
      !token.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "QR token tidak valid",
      });
    }

    const order = await pickupOrderByQrToken(
      req.user!.businessId,
      req.user!.userId,
      token.trim()
    );

    return res.json({
      success: true,
      message: "Order berhasil diambil",
      data: order,
    });
  } catch (error) {
    console.error(
      "Pickup order by QR error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal memproses pickup order";

    if (
      message.includes("QR order tidak ditemukan") ||
      message.includes("belum siap diambil")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gagal memproses pickup order",
    });
  }
}

export async function scanOrderQr(
  req: AuthRequest,
  res: Response
) {
  try {
    const token = req.params.token;

    if (
      typeof token !== "string" ||
      !token.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "QR token tidak valid",
      });
    }

    const order =
      await scanOrderQrToken(
        req.user!.businessId,
        token.trim()
      );

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Scan order QR error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal membaca QR order";

    if (
      message.includes(
        "QR order tidak ditemukan"
      ) ||
      message.includes(
        "belum siap diambil"
      )
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Gagal membaca QR order",
    });
  }
}