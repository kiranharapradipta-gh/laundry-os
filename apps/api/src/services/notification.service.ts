import {
  sendWhatsAppText,
  sendWhatsAppImage,
} from "./whatsapp-gateway.service.js";

import {
  generateQRCodeImage,
} from "./qr-image.service.js";

// ========================================
// ORDER CREATED
// ========================================

export async function sendOrderCreatedNotification(
  phone: string,
  customerName: string,
  orderNumber: string,
  total: number
) {
  const message = `🧺 *Order Laundry Berhasil Dibuat*

Halo ${customerName}! 👋

Order kamu sudah berhasil dibuat.

📋 Nomor Order: *${orderNumber}*
📦 Status: *Diterima*
💰 Total: *Rp ${total.toLocaleString("id-ID")}*

Pesanan kamu sedang diproses.

Terima kasih sudah menggunakan LaundryOS! 🙏`;

  return sendWhatsAppText(
    phone,
    message
  );
}

// ========================================
// ORDER STATUS
// ========================================

export async function sendOrderStatusNotification(
  phone: string,
  customerName: string,
  orderNumber: string|undefined,
  status: string
) {
  const statusMessages: Record<
    string,
    string
  > = {
    WASHING:
      "🧼 Pesanan kamu sedang dicuci.",

    DRYING:
      "☀️ Pesanan kamu sedang dalam proses pengeringan.",

    IRONING:
      "👕 Pesanan kamu sedang disetrika.",

    READY:
      "🎉 Pesanan kamu sudah selesai dan siap diambil!",

    PICKED_UP:
      "✅ Pesanan kamu sudah diambil. Terima kasih sudah menggunakan LaundryOS! 🙏",

    CANCELLED:
      "❌ Pesanan kamu telah dibatalkan.",
  };

  const statusText =
    statusMessages[status];

  if (!statusText) {
    return null;
  }

  const message = `🧺 *Update Pesanan Laundry*

Halo ${customerName}! 👋

📋 Nomor Order: *${orderNumber}*

${statusText}`;

  return sendWhatsAppText(
    phone,
    message
  );
}

export async function sendOrderReadyNotification(
  phone: string,
  customerName: string,
  orderNumber: string|undefined,
  qrToken: string
) {
  const message = `🧺 *Pesanan Laundry Siap Diambil*

Halo ${customerName}! 👋

🎉 Pesanan kamu sudah selesai dan siap diambil.

📋 Nomor Order: *${orderNumber}*

Silakan tunjukkan *QR Order* ini kepada petugas saat mengambil pesanan.

Terima kasih sudah menggunakan LaundryOS! 🙏`;

  const qrImage =
    await generateQRCodeImage(qrToken);

  await sendWhatsAppImage(
    phone,
    qrImage,
    message
  );
}

// import {
//   sendWhatsAppText,
// } from "./whatsapp-gateway.service.js";

// /**
//  * Kirim notifikasi WhatsApp ke customer.
//  *
//  * Semua logic pengiriman WhatsApp dari fitur lain
//  * sebaiknya lewat service ini, bukan langsung
//  * memanggil whatsapp-gateway.service.ts.
//  */
// export async function sendCustomerWhatsApp(
//   phone: string,
//   message: string
// ) {
//   return sendWhatsAppText(
//     phone,
//     message
//   );
// }