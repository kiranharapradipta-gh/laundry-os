import { getServices, getServiceById, createService, updateService, } from "../services/service.service.js";
export async function listServices(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Tidak terautentikasi",
            });
        }
        const includeInactive = req.query.includeInactive === "true";
        const services = await getServices(req.user.businessId, includeInactive);
        return res.json({
            success: true,
            data: services,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil service",
        });
    }
}
export async function getService(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Tidak terautentikasi",
            });
        }
        const serviceId = req.params.id;
        if (typeof serviceId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Service ID tidak valid",
            });
        }
        const service = await getServiceById(req.user.businessId, serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service tidak ditemukan",
            });
        }
        return res.json({
            success: true,
            data: service,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil service",
        });
    }
}
export async function create(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Tidak terautentikasi",
            });
        }
        const { name, description, price, unit, } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name dan price wajib diisi",
            });
        }
        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) ||
            numericPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Price tidak valid",
            });
        }
        const service = await createService(req.user.businessId, {
            name: name.trim(),
            ...(typeof description === "string" &&
                description.trim() && {
                description: description.trim(),
            }),
            price: numericPrice,
            ...(typeof unit === "string" &&
                unit.trim() && {
                unit: unit.trim(),
            }),
        });
        return res.status(201).json({
            success: true,
            data: service,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Gagal membuat service",
        });
    }
}
export async function update(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Tidak terautentikasi",
            });
        }
        const serviceId = req.params.id;
        if (typeof serviceId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Service ID tidak valid",
            });
        }
        const { name, description, price, unit, isActive, } = req.body;
        let numericPrice;
        if (price !== undefined) {
            numericPrice = Number(price);
            if (!Number.isFinite(numericPrice) ||
                numericPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price tidak valid",
                });
            }
        }
        const service = await updateService(req.user.businessId, serviceId, {
            ...(name !== undefined && {
                name: String(name).trim(),
            }),
            ...(description !== undefined && {
                description: String(description).trim(),
            }),
            ...(numericPrice !== undefined && {
                price: numericPrice,
            }),
            ...(unit !== undefined && {
                unit: String(unit).trim(),
            }),
            ...(isActive !== undefined && {
                isActive: Boolean(isActive),
            }),
        });
        return res.json({
            success: true,
            data: service,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Gagal mengupdate service",
        });
    }
}
//# sourceMappingURL=service.controller.js.map