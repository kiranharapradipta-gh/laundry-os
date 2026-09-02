import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}
export async function loginUser(phone, password) {
    const user = await prisma.user.findFirst({
        where: {
            phone,
            isActive: true,
        },
        include: {
            business: true,
        },
    });
    if (!user) {
        throw new Error("Nomor HP atau password salah");
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
        throw new Error("Nomor HP atau password salah");
    }
    const token = jwt.sign({
        userId: user.id,
        businessId: user.businessId,
        role: user.role,
    }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            businessId: user.businessId,
            businessName: user.business.name,
        },
    };
}
//# sourceMappingURL=auth.service.js.map