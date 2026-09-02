import { prisma } from "../config/database.js";
import { createSignedUrl } from "./file-storage.service.js";
export async function getOrderByQrToken(token) {
    const qrCode = await prisma.qRCode.findFirst({
        where: {
            token,
            type: "ORDER",
            isActive: true,
        },
        include: {
            order: {
                include: {
                    customer: true,
                    items: {
                        include: {
                            service: true,
                            photos: true,
                        },
                    },
                },
            },
        },
    });
    if (!qrCode || !qrCode.order) {
        throw new Error("QR order tidak ditemukan atau sudah tidak aktif");
    }
    const order = qrCode.order;
    const items = await Promise.all(order.items.map(async (item) => {
        const photos = await Promise.all(item.photos.map(async (photo) => {
            let url = photo.url;
            if (photo.storageKey) {
                url = await createSignedUrl(photo.storageKey, 60 * 15);
            }
            return {
                id: photo.id,
                url,
            };
        }));
        return {
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            notes: item.notes,
            photos,
        };
    }));
    return {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        customer: {
            name: order.customer.name,
            nickname: order.customer.nickname,
        },
        items,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        paidAmount: order.paidAmount,
        receivedAt: order.receivedAt,
        readyAt: order.readyAt,
        pickedUpAt: order.pickedUpAt,
    };
}
export async function pickupOrderByQrToken(businessId, changedById, token) {
    const qrCode = await prisma.qRCode.findFirst({
        where: {
            token,
            type: "ORDER",
            isActive: true,
            businessId,
        },
        include: {
            order: true,
        },
    });
    if (!qrCode || !qrCode.order) {
        throw new Error("QR order tidak ditemukan atau sudah tidak aktif");
    }
    const order = qrCode.order;
    if (order.status !== "READY") {
        throw new Error(`Order belum siap diambil. Status saat ini: ${order.status}`);
    }
    const now = new Date();
    return prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
            where: {
                id: order.id,
            },
            data: {
                status: "PICKED_UP",
                pickedUpAt: now,
            },
        });
        await tx.orderStatusHistory.create({
            data: {
                orderId: order.id,
                changedById,
                fromStatus: "READY",
                toStatus: "PICKED_UP",
                note: "Order diambil customer melalui QR",
            },
        });
        await tx.storageAssignment.updateMany({
            where: {
                orderId: order.id,
                releasedAt: null,
            },
            data: {
                releasedAt: now,
            },
        });
        return updatedOrder;
    });
}
//# sourceMappingURL=qr.service.js.map