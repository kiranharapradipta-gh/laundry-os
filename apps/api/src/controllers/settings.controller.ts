import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  changePassword,
  getSettings,
  updateBusiness,
  updateProfile,
} from "../services/settings.service.js";

export async function getSettingsController(
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

    const data = await getSettings(
      req.user.userId,
      req.user.businessId
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengambil settings",
    });
  }
}

export async function updateProfileController(
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

    const data = await updateProfile(
      req.user.userId,
      req.user.businessId,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
      }
    );

    return res.json({
      success: true,
      message: "Profile berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui profile",
    });
  }
}

export async function updateBusinessController(
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

    const data = await updateBusiness(
      req.user.userId,
      req.user.businessId,
      {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
      }
    );

    return res.json({
      success: true,
      message: "Informasi laundry berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui informasi laundry",
    });
  }
}

export async function changePasswordController(
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

    const { currentPassword, newPassword } = req.body;

    await changePassword(
      req.user.userId,
      req.user.businessId,
      currentPassword,
      newPassword
    );

    return res.json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengubah password",
    });
  }
}