export declare function getOrderByQrToken(token: string): Promise<{
    orderNumber: string;
    status: import("@prisma/client").$Enums.OrderStatus;
    paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
    customer: {
        name: string;
        nickname: string | null;
    };
    items: {
        description: string;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        photos: {
            id: string;
            url: string;
        }[];
    }[];
    subtotal: import("@prisma/client-runtime-utils").Decimal;
    discount: import("@prisma/client-runtime-utils").Decimal;
    total: import("@prisma/client-runtime-utils").Decimal;
    paidAmount: import("@prisma/client-runtime-utils").Decimal;
    receivedAt: Date;
    readyAt: Date | null;
    pickedUpAt: Date | null;
}>;
export declare function pickupOrderByQrToken(businessId: string, changedById: string, token: string): Promise<{
    id: string;
    businessId: string;
    createdAt: Date;
    updatedAt: Date;
    orderNumber: string;
    status: import("@prisma/client").$Enums.OrderStatus;
    paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
    subtotal: import("@prisma/client-runtime-utils").Decimal;
    discount: import("@prisma/client-runtime-utils").Decimal;
    total: import("@prisma/client-runtime-utils").Decimal;
    paidAmount: import("@prisma/client-runtime-utils").Decimal;
    notes: string | null;
    receivedAt: Date;
    readyAt: Date | null;
    pickedUpAt: Date | null;
    cancelledAt: Date | null;
    customerId: string;
    createdById: string | null;
}>;
//# sourceMappingURL=qr.service.d.ts.map