import dotenv from "dotenv";

dotenv.config();

import express from "express";

import {
  isWhatsAppConnected,
  sendText,
  sendImage,
} from "./services/whatsapp.service.js";

const GATEWAY_API_KEY =
  process.env.GATEWAY_API_KEY;

if (!GATEWAY_API_KEY) {
  throw new Error(
    "GATEWAY_API_KEY belum diset"
  );
}

function gatewayAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const apiKey =
    req.headers["x-api-key"];

  if (
    typeof apiKey !== "string" ||
    apiKey !== GATEWAY_API_KEY
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}

export function startHttpServer() {
  const app = express();

  const PORT = 3001;

  app.use(express.json());

  app.get("/health", (_req, res) => {
    return res.json({
      success: true,
      connected: isWhatsAppConnected(),
    });
  });

  app.post("/send-text", gatewayAuth, async (req, res) => {
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

      const result = await sendText(
        phone,
        message
      );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(
        "Send text error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengirim pesan",
      });
    }
  });

  app.post("/send-image", gatewayAuth, async (req, res) => {
      try {
        const {
          phone,
          imageBase64,
          caption,
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
          typeof imageBase64 !== "string" ||
          !imageBase64.trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "imageBase64 wajib diisi",
          });
        }

        const image = Buffer.from(
          imageBase64,
          "base64"
        );

        const result = await sendImage(
          phone,
          image,
          typeof caption === "string"
            ? caption
            : undefined
        );

        return res.json({
          success: true,
          data: result,
        });
      } catch (error) {
        console.error(
          "Send image error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Gagal mengirim gambar",
        });
      }
    }
  );

  app.listen(PORT, () => {
    console.log(
      `🚀 WhatsApp Gateway API berjalan di http://localhost:${PORT}`
    );
  });
}