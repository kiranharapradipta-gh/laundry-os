import dotenv from "dotenv";
dotenv.config({
    path: "apps/api/.env",
});
const GATEWAY_URL = process.env.WHATSAPP_GATEWAY_URL;
const GATEWAY_API_KEY = process.env.WHATSAPP_GATEWAY_API_KEY;
if (!GATEWAY_URL) {
    throw new Error("WHATSAPP_GATEWAY_URL belum diset");
}
if (!GATEWAY_API_KEY) {
    throw new Error("WHATSAPP_GATEWAY_API_KEY belum diset");
}
export async function sendWhatsAppText(phone, message) {
    const response = await fetch(`${GATEWAY_URL}/send-text`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": GATEWAY_API_KEY,
        },
        body: JSON.stringify({
            phone,
            message,
        }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message ||
            "Gagal mengirim WhatsApp");
    }
    return data;
}
//# sourceMappingURL=whatsapp-gateway.service.js.map