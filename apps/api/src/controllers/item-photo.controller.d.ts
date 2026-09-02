import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare function create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=item-photo.controller.d.ts.map