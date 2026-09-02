import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare function listCustomers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCustomer(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=customer.controller.d.ts.map