import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare function listServices(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getService(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=service.controller.d.ts.map