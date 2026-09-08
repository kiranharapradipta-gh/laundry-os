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