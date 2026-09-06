import { prisma } from "../config/database.js";

interface CreateStorageInput {
  zone?: string;
  rack?: string;
  shelf?: string;
  slot?: string;
}

interface UpdateStorageInput {
  zone?: string;
  rack?: string;
  shelf?: string;
  slot?: string;
  isActive?: boolean;
}

export async function getStorageLocations(
  businessId: string,
  includeInactive = false
) {
  return prisma.storageLocation.findMany({
    where: {
      businessId,
      ...(includeInactive
        ? {}
        : {
            isActive: true,
          }),
    },

    include: {
      assignments: {
        where: {
          releasedAt: null,
        },

        orderBy: {
          assignedAt: "desc",
        },

        take: 1,

        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,

              customer: {
                select: {
                  id: true,
                  name: true,
                  nickname: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getStorageLocationById(
  businessId: string,
  storageId: string
) {
  return prisma.storageLocation.findFirst({
    where: {
      id: storageId,
      businessId,
    },
  });
}

export async function createStorageLocation(
  businessId: string,
  input: CreateStorageInput
) {
  return prisma.storageLocation.create({
    data: {
      businessId,

      ...(input.zone !== undefined && {
        zone: input.zone,
      }),

      ...(input.rack !== undefined && {
        rack: input.rack,
      }),

      ...(input.shelf !== undefined && {
        shelf: input.shelf,
      }),

      ...(input.slot !== undefined && {
        slot: input.slot,
      }),
    },
  });
}

export async function updateStorageLocation(
  businessId: string,
  storageId: string,
  input: UpdateStorageInput
) {
  const storage = await prisma.storageLocation.findFirst({
    where: {
      id: storageId,
      businessId,
    },
  });

  if (!storage) {
    throw new Error("Storage location tidak ditemukan");
  }

  return prisma.storageLocation.update({
    where: {
      id: storageId,
    },

    data: {
      ...(input.zone !== undefined && {
        zone: input.zone,
      }),

      ...(input.rack !== undefined && {
        rack: input.rack,
      }),

      ...(input.shelf !== undefined && {
        shelf: input.shelf,
      }),

      ...(input.slot !== undefined && {
        slot: input.slot,
      }),

      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
    },
  });
}