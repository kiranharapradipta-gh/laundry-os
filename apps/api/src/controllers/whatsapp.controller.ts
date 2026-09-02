import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  sendWhatsAppText,
} from "../services/whatsapp-gateway.service.js";

export async function sendTestMessage(
  req: AuthRequest,
  res: Response
) {
  try {
    const {
      phone,
      message,
    } = req.body;

    if (
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone wajib diisi",
      });
    }

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message wajib diisi",
      });
    }

    const result =
      await sendWhatsAppText(
        phone,
        message
      );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "WhatsApp test error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengirim WhatsApp",
    });
  }
}