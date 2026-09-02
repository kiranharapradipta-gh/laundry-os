import "dotenv/config";

import express from "express";
import cors from "cors";
import { prisma } from "./config/database.js";

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import orderRoutes from "./routes/order.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import itemPhotoRoutes from "./routes/item-photo.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "LaundryOS API is running",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Database connection is healthy",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});





















































app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api", itemPhotoRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.listen(PORT, () => {
  console.log(`🚀 LaundryOS API running on http://localhost:${PORT}`);
});