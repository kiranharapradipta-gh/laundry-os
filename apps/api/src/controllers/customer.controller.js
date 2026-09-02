import { getCustomers, getCustomerById, createCustomer, updateCustomer, } from "../services/customer.service.js";
export async function listCustomers(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Tidak terautentikasi",
            });
        }
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const customers = await getCustomers(req.user.businessId, search);
        return res.json({
            success: true,
            data: customers,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil customer",
        });
    }
}
export async function getCustomer(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Tidak terautentikasi",
            });
        }
        const customerId = req.params.id;
        if (typeof customerId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Customer ID tidak valid",
            });
        }
        const customer = await getCustomerById(req.user.businessId, customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer tidak ditemukan",
            });
        }
        return res.json({
            success: true,
            data: customer,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil customer",
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
        const { phone, name, nickname } = req.body;
        if (!phone || !name) {
            return res.status(400).json({
                success: false,
                message: "Phone dan name wajib diisi",
            });
        }
        const customer = await createCustomer(req.user.businessId, {
            phone: phone.trim(),
            name: name.trim(),
            nickname: nickname?.trim() || undefined,
        });
        return res.status(201).json({
            success: true,
            data: customer,
        });
    }
    catch (error) {
        console.error(error);
        const message = error instanceof Error
            ? error.message
            : "Gagal membuat customer";
        return res.status(400).json({
            success: false,
            message,
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
        const { phone, name, nickname } = req.body;
        const customerId = req.params.id;
        if (typeof customerId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Customer ID tidak valid",
            });
        }
        const customer = await updateCustomer(req.user.businessId, customerId, {
            ...(phone !== undefined && {
                phone: phone.trim(),
            }),
            ...(name !== undefined && {
                name: name.trim(),
            }),
            ...(nickname !== undefined && {
                nickname: nickname.trim(),
            }),
        });
        return res.json({
            success: true,
            data: customer,
        });
    }
    catch (error) {
        console.error(error);
        const message = error instanceof Error
            ? error.message
            : "Gagal mengupdate customer";
        return res.status(400).json({
            success: false,
            message,
        });
    }
}
//# sourceMappingURL=customer.controller.js.map