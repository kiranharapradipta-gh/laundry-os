import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare function create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function get(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=order.controller.d.ts.map