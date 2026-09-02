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
export declare function getStorageLocations(businessId: string, includeInactive?: boolean): Promise<{
    id: string;
    businessId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    zone: string | null;
    rack: string | null;
    shelf: string | null;
    slot: string | null;
}[]>;
export declare function getStorageLocationById(businessId: string, storageId: string): Promise<{
    id: string;
    businessId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    zone: string | null;
    rack: string | null;
    shelf: string | null;
    slot: string | null;
} | null>;
export declare function createStorageLocation(businessId: string, input: CreateStorageInput): Promise<{
    id: string;
    businessId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    zone: string | null;
    rack: string | null;
    shelf: string | null;
    slot: string | null;
}>;
export declare function updateStorageLocation(businessId: string, storageId: string, input: UpdateStorageInput): Promise<{
    id: string;
    businessId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    zone: string | null;
    rack: string | null;
    shelf: string | null;
    slot: string | null;
}>;
export {};
//# sourceMappingURL=storage.service.d.ts.map