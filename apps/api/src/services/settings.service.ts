import bcrypt from "bcrypt";

import { prisma } from "../config/database.js";

export async function getSettings(userId: string, businessId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      businessId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      businessId: true,
      business: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
          logoUrl: true,

          settings: {
            select: {
              id: true,
              openingTime: true,
              closingTime: true,
              operatingDays: true,
              processingDays: true,
              defaultOrderStatus: true,
              allowOrderCancellation: true,
              confirmBeforeDelete: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  return user;
}

export async function updateProfile(
  userId: string,
  businessId: string,
  data: {
    name?: string;
    phone?: string;
    email?: string | null;
  }
) {
  const name = data.name?.trim();
  const phone = data.phone?.trim();
  const email = data.email?.trim() || null;

  if (name !== undefined && !name) {
    throw new Error("Nama tidak boleh kosong");
  }

  if (phone !== undefined && !phone) {
    throw new Error("Nomor HP tidak boleh kosong");
  }

  if (phone !== undefined) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phone,
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new Error("Nomor HP sudah digunakan");
    }
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      businessId: true,
    },
  });

  if (user.businessId !== businessId) {
    throw new Error("Akses business tidak valid");
  }

  return user;
}

export async function updateBusiness(
  userId: string,
  businessId: string,
  data: {
    name?: string;
    phone?: string | null;
    address?: string | null;
  }
) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      businessId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const name = data.name?.trim();

  if (name !== undefined && !name) {
    throw new Error("Nama laundry tidak boleh kosong");
  }

  return prisma.business.update({
    where: {
      id: businessId,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(data.phone !== undefined && {
        phone: data.phone?.trim() || null,
      }),
      ...(data.address !== undefined && {
        address: data.address?.trim() || null,
      }),
    },
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      logoUrl: true,
    },
  });
}

export async function updateOperationalSettings(
  userId: string,
  businessId: string,
  data: {
    openingTime?: string;
    closingTime?: string;
    operatingDays?: number[];
    processingDays?: number;
    defaultOrderStatus?: "RECEIVED";
    allowOrderCancellation?: boolean;
    confirmBeforeDelete?: boolean;
  }
) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      businessId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (
    data.openingTime !== undefined &&
    !/^\d{2}:\d{2}$/.test(data.openingTime)
  ) {
    throw new Error("Jam buka tidak valid");
  }

  if (
    data.closingTime !== undefined &&
    !/^\d{2}:\d{2}$/.test(data.closingTime)
  ) {
    throw new Error("Jam tutup tidak valid");
  }

  if (
    data.processingDays !== undefined &&
    (data.processingDays < 1 || data.processingDays > 30)
  ) {
    throw new Error("Estimasi pengerjaan harus antara 1-30 hari");
  }

  if (data.operatingDays !== undefined) {
    const validDays = data.operatingDays.every(
      (day) => Number.isInteger(day) && day >= 1 && day <= 7
    );

    if (!validDays) {
      throw new Error("Hari operasional tidak valid");
    }
  }

  return prisma.businessSettings.upsert({
    where: {
      businessId,
    },

    create: {
      businessId,

      openingTime: data.openingTime ?? "08:00",
      closingTime: data.closingTime ?? "21:00",

      operatingDays: data.operatingDays ?? [1, 2, 3, 4, 5, 6],

      processingDays: data.processingDays ?? 2,

      defaultOrderStatus: "RECEIVED",

      allowOrderCancellation:
        data.allowOrderCancellation ?? true,

      confirmBeforeDelete:
        data.confirmBeforeDelete ?? true,
    },

    update: {
      ...(data.openingTime !== undefined && {
        openingTime: data.openingTime,
      }),

      ...(data.closingTime !== undefined && {
        closingTime: data.closingTime,
      }),

      ...(data.operatingDays !== undefined && {
        operatingDays: data.operatingDays,
      }),

      ...(data.processingDays !== undefined && {
        processingDays: data.processingDays,
      }),

      ...(data.allowOrderCancellation !== undefined && {
        allowOrderCancellation: data.allowOrderCancellation,
      }),

      ...(data.confirmBeforeDelete !== undefined && {
        confirmBeforeDelete: data.confirmBeforeDelete,
      }),
    },

    select: {
      id: true,
      openingTime: true,
      closingTime: true,
      operatingDays: true,
      processingDays: true,
      defaultOrderStatus: true,
      allowOrderCancellation: true,
      confirmBeforeDelete: true,
    },
  });
}

export async function changePassword(
  userId: string,
  businessId: string,
  currentPassword: string,
  newPassword: string
) {
  if (!currentPassword || !newPassword) {
    throw new Error("Password lama dan password baru wajib diisi");
  }

  if (newPassword.length < 6) {
    throw new Error("Password baru minimal 6 karakter");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      businessId,
      isActive: true,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const passwordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordValid) {
    throw new Error("Password lama salah");
  }

  const samePassword = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (samePassword) {
    throw new Error("Password baru tidak boleh sama dengan password lama");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}