import crypto from "node:crypto";
import { prisma } from "../config/database.js";
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();
    return `ORD-${year}${month}${day}-${random}`;
}
function generateQrToken() {
    return crypto.randomBytes(32).toString("hex");
}
// ========================================
// CREATE ORDER
// ========================================
export async function createOrder(businessId, createdById, input) {
    if (!input.items || input.items.length === 0) {
        throw new Error("Order harus memiliki minimal satu item");
    }
    // ========================================
    // CUSTOMER
    // ========================================
    const customer = await prisma.customer.findFirst({
        where: {
            id: input.customerId,
            businessId,
        },
    });
    if (!customer) {
        throw new Error("Customer tidak ditemukan");
    }
    // ========================================
    // STORAGE
    // ========================================
    if (input.storageLocationId) {
        const storage = await prisma.storageLocation.findFirst({
            where: {
                id: input.storageLocationId,
                businessId,
                isActive: true,
            },
        });
        if (!storage) {
            throw new Error("Storage location tidak ditemukan atau tidak aktif");
        }
    }
    // ========================================
    // SERVICES
    // ========================================
    const serviceIds = input.items
        .map((item) => item.serviceId)
        .filter((id) => Boolean(id));
    const services = await prisma.service.findMany({
        where: {
            id: {
                in: serviceIds,
            },
            businessId,
            isActive: true,
        },
    });
    const serviceMap = new Map(services.map((service) => [
        service.id,
        service,
    ]));
    // ========================================
    // CALCULATE ITEMS
    // ========================================
    let subtotal = 0;
    const processedItems = input.items.map((item) => {
        let unitPrice = 0;
        if (item.serviceId) {
            const service = serviceMap.get(item.serviceId);
            if (!service) {
                throw new Error(`Service tidak ditemukan: ${item.serviceId}`);
            }
            unitPrice = Number(service.price);
        }
        if (item.quantity <= 0) {
            throw new Error("Quantity harus lebih besar dari 0");
        }
        const itemSubtotal = unitPrice * item.quantity;
        subtotal += itemSubtotal;
        return {
            serviceId: item.serviceId ?? null,
            description: item.description,
            quantity: item.quantity,
            unitPrice,
            subtotal: itemSubtotal,
            notes: item.notes ?? null,
        };
    });
    // ========================================
    // DISCOUNT
    // ========================================
    const discount = input.discount ?? 0;
    if (discount < 0) {
        throw new Error("Discount tidak boleh negatif");
    }
    if (discount > subtotal) {
        throw new Error("Discount tidak boleh lebih besar dari subtotal");
    }
    const total = subtotal - discount;
    // ========================================
    // QR
    // ========================================
    const qrToken = generateQrToken();
    // ========================================
    // ORDER NUMBER
    // ========================================
    const orderNumber = generateOrderNumber();
    // ========================================
    // CREATE EVERYTHING
    // ========================================
    const order = await prisma.$transaction(async (tx) => {
        // ------------------------------------
        // ORDER
        // ------------------------------------
        const createdOrder = await tx.order.create({
            data: {
                businessId,
                customerId: input.customerId,
                createdById,
                orderNumber,
                status: "RECEIVED",
                paymentStatus: "UNPAID",
                subtotal,
                discount,
                total,
                paidAmount: 0,
                notes: input.notes ?? null,
                // --------------------------------
                // ITEMS
                // --------------------------------
                items: {
                    create: processedItems,
                },
            },
        });
        // ------------------------------------
        // QR CODE
        // ------------------------------------
        await tx.qRCode.create({
            data: {
                businessId,
                orderId: createdOrder.id,
                type: "ORDER",
                token: qrToken,
            },
        });
        // ------------------------------------
        // STATUS HISTORY
        // ------------------------------------
        await tx.orderStatusHistory.create({
            data: {
                orderId: createdOrder.id,
                changedById: createdById,
                fromStatus: null,
                toStatus: "RECEIVED",
                note: "Order dibuat",
            },
        });
        // ------------------------------------
        // STORAGE
        // ------------------------------------
        if (input.storageLocationId) {
            await tx.storageAssignment.create({
                data: {
                    orderId: createdOrder.id,
                    storageLocationId: input.storageLocationId,
                    assignedById: createdById,
                },
            });
        }
        return createdOrder;
    });
    // ========================================
    // RETURN COMPLETE ORDER
    // ========================================
    return prisma.order.findUnique({
        where: {
            id: order.id,
        },
        include: {
            customer: true,
            items: {
                include: {
                    service: true,
                },
            },
            qrCodes: true,
            statusHistory: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            storageAssignments: {
                include: {
                    storageLocation: true,
                },
            },
        },
    });
}
// ========================================
// GET ORDERS
// ========================================
export async function getOrders(businessId) {
    return prisma.order.findMany({
        where: {
            businessId,
        },
        include: {
            customer: true,
            items: {
                include: {
                    service: true,
                },
            },
            qrCodes: true,
            statusHistory: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            storageAssignments: {
                where: {
                    releasedAt: null,
                },
                include: {
                    storageLocation: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
// ========================================
// GET ORDER BY ID
// ========================================
export async function getOrderById(businessId, orderId) {
    return prisma.order.findFirst({
        where: {
            id: orderId,
            businessId,
        },
        include: {
            customer: true,
            items: {
                include: {
                    service: true,
                    photos: true,
                },
            },
            qrCodes: true,
            statusHistory: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            storageAssignments: {
                where: {
                    releasedAt: null,
                },
                include: {
                    storageLocation: true,
                },
            },
            payments: true,
            complaints: true,
        },
    });
}
function validateStatusTransition(currentStatus, nextStatus) {
    const allowedTransitions = {
        RECEIVED: ["WASHING", "CANCELLED"],
        WASHING: ["DRYING", "CANCELLED"],
        DRYING: ["IRONING", "CANCELLED"],
        IRONING: ["READY", "CANCELLED"],
        READY: ["PICKED_UP", "CANCELLED"],
        PICKED_UP: [],
        CANCELLED: [],
    };
    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
        throw new Error(`Status tidak dapat diubah dari ${currentStatus} ke ${nextStatus}`);
    }
}
// ========================================
// UPDATE STATUS
// ========================================
export async function updateOrderStatus(businessId, orderId, changedById, input) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            businessId,
        },
    });
    if (!order) {
        throw new Error("Order tidak ditemukan");
    }
    validateStatusTransition(order.status, input.status);
    const now = new Date();
    const updateData = {
        status: input.status,
    };
    if (input.status === "READY") {
        updateData.readyAt = now;
    }
    if (input.status === "PICKED_UP") {
        updateData.pickedUpAt = now;
    }
    if (input.status === "CANCELLED") {
        updateData.cancelledAt = now;
    }
    return prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
            where: {
                id: orderId,
            },
            data: updateData,
        });
        await tx.orderStatusHistory.create({
            data: {
                orderId,
                changedById,
                fromStatus: order.status,
                toStatus: input.status,
                note: input.note ?? null,
            },
        });
        // ------------------------------------
        // RELEASE STORAGE
        // ------------------------------------
        if (input.status === "PICKED_UP" ||
            input.status === "CANCELLED") {
            await tx.storageAssignment.updateMany({
                where: {
                    orderId,
                    releasedAt: null,
                },
                data: {
                    releasedAt: now,
                },
            });
        }
        return updatedOrder;
    });
}
//# sourceMappingURL=order.service.js.map