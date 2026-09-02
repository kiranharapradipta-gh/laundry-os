interface CreateOrderItemInput {
    serviceId?: string;
    description: string;
    quantity: number;
    notes?: string;
}
interface CreateOrderInput {
    customerId: string;
    storageLocationId?: string;
    discount?: number;
    notes?: string;
    items: CreateOrderItemInput[];
}
interface UpdateOrderStatusInput {
    status: "RECEIVED" | "WASHING" | "DRYING" | "IRONING" | "READY" | "PICKED_UP" | "CANCELLED";
    note?: string;
}
export declare function createOrder(businessId: string, createdById: string, input: CreateOrderInput): Promise<({
    storageAssignments: ({
        storageLocation: {
            id: string;
            businessId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            zone: string | null;
            rack: string | null;
            shelf: string | null;
            slot: string | null;
        };
    } & {
        id: string;
        orderId: string;
        assignedAt: Date;
        releasedAt: Date | null;
        storageLocationId: string;
        assignedById: string | null;
    })[];
    qrCodes: {
        id: string;
        businessId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        customerId: string | null;
        orderId: string | null;
        type: import("@prisma/client").$Enums.QRType;
    }[];
    customer: {
        id: string;
        businessId: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        nickname: string | null;
    };
    items: ({
        service: {
            id: string;
            businessId: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            unit: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        serviceId: string | null;
        orderId: string;
    })[];
    statusHistory: {
        id: string;
        createdAt: Date;
        orderId: string;
        changedById: string | null;
        fromStatus: import("@prisma/client").$Enums.OrderStatus | null;
        toStatus: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
    }[];
} & {
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
}) | null>;
export declare function getOrders(businessId: string): Promise<({
    storageAssignments: ({
        storageLocation: {
            id: string;
            businessId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            zone: string | null;
            rack: string | null;
            shelf: string | null;
            slot: string | null;
        };
    } & {
        id: string;
        orderId: string;
        assignedAt: Date;
        releasedAt: Date | null;
        storageLocationId: string;
        assignedById: string | null;
    })[];
    qrCodes: {
        id: string;
        businessId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        customerId: string | null;
        orderId: string | null;
        type: import("@prisma/client").$Enums.QRType;
    }[];
    customer: {
        id: string;
        businessId: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        nickname: string | null;
    };
    items: ({
        service: {
            id: string;
            businessId: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            unit: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        serviceId: string | null;
        orderId: string;
    })[];
    statusHistory: {
        id: string;
        createdAt: Date;
        orderId: string;
        changedById: string | null;
        fromStatus: import("@prisma/client").$Enums.OrderStatus | null;
        toStatus: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
    }[];
} & {
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
})[]>;
export declare function getOrderById(businessId: string, orderId: string): Promise<({
    storageAssignments: ({
        storageLocation: {
            id: string;
            businessId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            zone: string | null;
            rack: string | null;
            shelf: string | null;
            slot: string | null;
        };
    } & {
        id: string;
        orderId: string;
        assignedAt: Date;
        releasedAt: Date | null;
        storageLocationId: string;
        assignedById: string | null;
    })[];
    qrCodes: {
        id: string;
        businessId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        customerId: string | null;
        orderId: string | null;
        type: import("@prisma/client").$Enums.QRType;
    }[];
    complaints: {
        id: string;
        businessId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        customerId: string;
        orderId: string | null;
        message: string;
        subject: string;
        response: string | null;
    }[];
    customer: {
        id: string;
        businessId: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        nickname: string | null;
    };
    items: ({
        service: {
            id: string;
            businessId: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            unit: string;
        } | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            orderItemId: string;
            storageKey: string | null;
            caption: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        serviceId: string | null;
        orderId: string;
    })[];
    statusHistory: {
        id: string;
        createdAt: Date;
        orderId: string;
        changedById: string | null;
        fromStatus: import("@prisma/client").$Enums.OrderStatus | null;
        toStatus: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
    }[];
    payments: {
        id: string;
        createdAt: Date;
        notes: string | null;
        orderId: string;
        method: import("@prisma/client").$Enums.PaymentMethod;
        amount: import("@prisma/client-runtime-utils").Decimal;
        reference: string | null;
        paidAt: Date;
    }[];
} & {
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
}) | null>;
export declare function updateOrderStatus(businessId: string, orderId: string, changedById: string, input: UpdateOrderStatusInput): Promise<{
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
export {};
//# sourceMappingURL=order.service.d.ts.map