import { prisma } from "../config/database.js";
export async function getStorageLocations(businessId, includeInactive = false) {
    return prisma.storageLocation.findMany({
        where: {
            businessId,
            ...(includeInactive
                ? {}
                : {
                    isActive: true,
                }),
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
export async function getStorageLocationById(businessId, storageId) {
    return prisma.storageLocation.findFirst({
        where: {
            id: storageId,
            businessId,
        },
    });
}
export async function createStorageLocation(businessId, input) {
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
export async function updateStorageLocation(businessId, storageId, input) {
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
//# sourceMappingURL=storage.service.js.map