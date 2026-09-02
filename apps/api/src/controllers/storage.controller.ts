import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  getStorageLocations,
  getStorageLocationById,
  createStorageLocation,
  updateStorageLocation,
} from "../services/storage.service.js";

export async function listStorageLocations(
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

    const includeInactive =
      req.query.includeInactive === "true";

    const locations = await getStorageLocations(
      req.user.businessId,
      includeInactive
    );

    return res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil storage location",
    });
  }
}

export async function getStorageLocation(
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

    const storageId = req.params.id;

    if (typeof storageId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Storage ID tidak valid",
      });
    }

    const location = await getStorageLocationById(
      req.user.businessId,
      storageId
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Storage location tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil storage location",
    });
  }
}

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
      zone,
      rack,
      shelf,
      slot,
    } = req.body;

    if (
      zone === undefined &&
      rack === undefined &&
      shelf === undefined &&
      slot === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimal salah satu dari zone, rack, shelf, atau slot wajib diisi",
      });
    }

    const cleanZone =
      typeof zone === "string"
        ? zone.trim()
        : undefined;

    const cleanRack =
      typeof rack === "string"
        ? rack.trim()
        : undefined;

    const cleanShelf =
      typeof shelf === "string"
        ? shelf.trim()
        : undefined;

    const cleanSlot =
      typeof slot === "string"
        ? slot.trim()
        : undefined;

    const location = await createStorageLocation(
      req.user.businessId,
      {
        ...(cleanZone && {
          zone: cleanZone,
        }),

        ...(cleanRack && {
          rack: cleanRack,
        }),

        ...(cleanShelf && {
          shelf: cleanShelf,
        }),

        ...(cleanSlot && {
          slot: cleanSlot,
        }),
      }
    );

    return res.status(201).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat storage location",
    });
  }
}

export async function update(
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

    const storageId = req.params.id;

    if (typeof storageId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Storage ID tidak valid",
      });
    }

    const {
      zone,
      rack,
      shelf,
      slot,
      isActive,
    } = req.body;

    if (
      zone !== undefined &&
      typeof zone !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Zone tidak valid",
      });
    }

    if (
      rack !== undefined &&
      typeof rack !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Rack tidak valid",
      });
    }

    if (
      shelf !== undefined &&
      typeof shelf !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Shelf tidak valid",
      });
    }

    if (
      slot !== undefined &&
      typeof slot !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Slot tidak valid",
      });
    }

    if (
      isActive !== undefined &&
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive harus boolean",
      });
    }

    const cleanZone =
      typeof zone === "string"
        ? zone.trim()
        : undefined;

    const cleanRack =
      typeof rack === "string"
        ? rack.trim()
        : undefined;

    const cleanShelf =
      typeof shelf === "string"
        ? shelf.trim()
        : undefined;

    const cleanSlot =
      typeof slot === "string"
        ? slot.trim()
        : undefined;

    const location = await updateStorageLocation(
      req.user.businessId,
      storageId,
      {
        ...(cleanZone !== undefined && {
          zone: cleanZone,
        }),

        ...(cleanRack !== undefined && {
          rack: cleanRack,
        }),

        ...(cleanShelf !== undefined && {
          shelf: cleanShelf,
        }),

        ...(cleanSlot !== undefined && {
          slot: cleanSlot,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      }
    );

    return res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengupdate storage location",
    });
  }
}