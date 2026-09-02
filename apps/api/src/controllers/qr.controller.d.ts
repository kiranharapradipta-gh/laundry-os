import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare function getOrderByQr(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function pickupOrderByQr(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=qr.controller.d.ts.map