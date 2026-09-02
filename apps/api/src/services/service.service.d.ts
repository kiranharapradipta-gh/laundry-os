interface CreateServiceInput {
    name: string;
    description?: string;
    price: number;
    unit?: string;
}
interface UpdateServiceInput {
    name?: string;
    description?: string;
    price?: number;
    unit?: string;
    isActive?: boolean;
}
export declare function getServices(businessId: string, includeInactive?: boolean): Promise<{
    id: string;
    businessId: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    unit: string;
}[]>;
export declare function getServiceById(businessId: string, serviceId: string): Promise<{
    id: string;
    businessId: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    unit: string;
} | null>;
export declare function createService(businessId: string, input: CreateServiceInput): Promise<{
    id: string;
    businessId: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    unit: string;
}>;
export declare function updateService(businessId: string, serviceId: string, input: UpdateServiceInput): Promise<{
    id: string;
    businessId: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    unit: string;
}>;
export {};
//# sourceMappingURL=service.service.d.ts.map