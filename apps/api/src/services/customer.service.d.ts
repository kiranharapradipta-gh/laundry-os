interface CreateCustomerInput {
    phone: string;
    name: string;
    nickname?: string;
}
interface UpdateCustomerInput {
    phone?: string;
    name?: string;
    nickname?: string;
}
export declare function getCustomers(businessId: string, search?: string): Promise<{
    id: string;
    businessId: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    nickname: string | null;
}[]>;
export declare function getCustomerById(businessId: string, customerId: string): Promise<{
    id: string;
    businessId: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    nickname: string | null;
} | null>;
export declare function createCustomer(businessId: string, input: CreateCustomerInput): Promise<{
    id: string;
    businessId: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    nickname: string | null;
}>;
export declare function updateCustomer(businessId: string, customerId: string, input: UpdateCustomerInput): Promise<{
    id: string;
    businessId: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    nickname: string | null;
}>;
export {};
//# sourceMappingURL=customer.service.d.ts.map