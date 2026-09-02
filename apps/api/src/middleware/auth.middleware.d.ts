import type { NextFunction, Request, Response } from "express";
export interface AuthUser {
    userId: string;
    businessId: string;
    role: "OWNER" | "EMPLOYEE";
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map