import { prisma } from "../config/database.js";
export async function getCustomers(businessId, search) {
    return prisma.customer.findMany({
        where: {
            businessId,
            ...(search
                ? {
                    OR: [
                        {
                            phone: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            nickname: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });
}
export async function getCustomerById(businessId, customerId) {
    return prisma.customer.findFirst({
        where: {
            id: customerId,
            businessId,
        },
    });
}
export async function createCustomer(businessId, input) {
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            businessId_phone: {
                businessId,
                phone: input.phone,
            },
        },
    });
    if (existingCustomer) {
        throw new Error("Customer dengan nomor WhatsApp tersebut sudah terdaftar");
    }
    return prisma.customer.create({
        data: {
            businessId,
            phone: input.phone,
            name: input.name,
            nickname: input.nickname ?? null,
        },
    });
}
export async function updateCustomer(businessId, customerId, input) {
    const customer = await prisma.customer.findFirst({
        where: {
            id: customerId,
            businessId,
        },
    });
    if (!customer) {
        throw new Error("Customer tidak ditemukan");
    }
    if (input.phone && input.phone !== customer.phone) {
        const existingCustomer = await prisma.customer.findUnique({
            where: {
                businessId_phone: {
                    businessId,
                    phone: input.phone,
                },
            },
        });
        if (existingCustomer) {
            throw new Error("Nomor WhatsApp tersebut sudah digunakan customer lain");
        }
    }
    return prisma.customer.update({
        where: {
            id: customerId,
        },
        data: {
            ...(input.phone !== undefined && {
                phone: input.phone,
            }),
            ...(input.name !== undefined && {
                name: input.name,
            }),
            ...(input.nickname !== undefined && {
                nickname: input.nickname,
            }),
        },
    });
}
//# sourceMappingURL=customer.service.js.map