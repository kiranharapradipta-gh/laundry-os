export declare function loginUser(phone: string, password: string): Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        businessId: string;
        businessName: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map