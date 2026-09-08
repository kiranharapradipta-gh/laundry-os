import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  getReportSummary,
} from "../services/report.service.js";

function parseDate(
  value: unknown,
  fieldName: string,
): Date {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      `${fieldName} wajib diisi.`,
    );
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `${fieldName} tidak valid.`,
    );
  }

  return date;
}

export async function summary(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Tidak terautentikasi",
      });
    }

    const from = parseDate(
      req.query.from,
      "Tanggal mulai",
    );

    const toInput = parseDate(
      req.query.to,
      "Tanggal akhir",
    );

    // `to` dari frontend dianggap sebagai
    // tanggal yang inclusive.
    //
    // Contoh:
    // to=2026-09-30
    //
    // akan menjadi:
    // < 2026-10-01 00:00:00
    const to = new Date(toInput);

    if (
      typeof req.query.to === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        req.query.to,
      )
    ) {
      to.setUTCDate(to.getUTCDate() + 1);
    }

    if (from >= to) {
      return res.status(400).json({
        success: false,
        message:
          "Tanggal mulai harus sebelum tanggal akhir.",
      });
    }

    const maxRangeMs =
      366 *
      24 *
      60 *
      60 *
      1000;

    if (to.getTime() - from.getTime() > maxRangeMs) {
      return res.status(400).json({
        success: false,
        message:
          "Rentang laporan maksimal 366 hari.",
      });
    }

    const data = await getReportSummary(
      req.user.businessId,
      {
        from,
        to,
      },
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Get report summary error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengambil laporan.",
    });
  }
}