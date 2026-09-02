import { prisma } from "../config/database.js";
// ========================================
// GET ALL SERVICES
// ========================================
export async function getServices(businessId, includeInactive = false) {
    return prisma.service.findMany({
        where: {
            businessId,
            ...(includeInactive
                ? {}
                : {
                    isActive: true,
                }),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
// ========================================
// GET SERVICE BY ID
// ========================================
export async function getServiceById(businessId, serviceId) {
    return prisma.service.findFirst({
        where: {
            id: serviceId,
            businessId,
        },
    });
}
// ========================================
// CREATE SERVICE
// ========================================
export async function createService(businessId, input) {
    return prisma.service.create({
        data: {
            businessId,
            name: input.name,
            description: input.description ?? null,
            price: input.price,
            unit: input.unit ?? "kg",
        },
    });
}
// ========================================
// UPDATE SERVICE
// ========================================
export async function updateService(businessId, serviceId, input) {
    const service = await prisma.service.findFirst({
        where: {
            id: serviceId,
            businessId,
        },
    });
    if (!service) {
        throw new Error("Service tidak ditemukan");
    }
    return prisma.service.update({
        where: {
            id: serviceId,
        },
        data: {
            ...(input.name !== undefined && {
                name: input.name,
            }),
            ...(input.description !== undefined && {
                description: input.description,
            }),
            ...(input.price !== undefined && {
                price: input.price,
            }),
            ...(input.unit !== undefined && {
                unit: input.unit,
            }),
            ...(input.isActive !== undefined && {
                isActive: input.isActive,
            }),
        },
    });
}
//# sourceMappingURL=service.service.js.map