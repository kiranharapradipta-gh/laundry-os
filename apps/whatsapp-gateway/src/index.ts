import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import P from "pino";
import QRCode from "qrcode";

import {
  setWhatsAppSocket,
  setWhatsAppConnected,
} from "./services/whatsapp.service.js";

import { startHttpServer } from "./server.js";

async function startWhatsApp() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./auth");

  const sock = makeWASocket({
    auth: state,

    logger: P({
      level: "silent",
    }),

    browser: [
      "LaundryOS",
      "Chrome",
      "1.0.0",
    ],
  });

  setWhatsAppSocket(sock);

  sock.ev.on(
    "creds.update",
    saveCreds
  );

  sock.ev.on(
    "connection.update",
    async (update) => {
      const {
        connection,
        lastDisconnect,
        qr,
      } = update;

      if (qr) {
        console.log("");
        console.log(
          "📱 Scan QR berikut dengan WhatsApp:"
        );

        const qrTerminal =
          await QRCode.toString(qr, {
            type: "terminal",
            small: true,
          });

        console.log(qrTerminal);
      }

      if (connection === "open") {
        setWhatsAppConnected(true);

        console.log("");
        console.log(
          "✅ WhatsApp berhasil terhubung!"
        );
        console.log("");
      }

      if (connection === "close") {
        setWhatsAppConnected(false);

        const statusCode =
          (lastDisconnect?.error as any)
            ?.output?.statusCode;

        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut;

        console.log(
          "❌ WhatsApp terputus."
        );

        if (shouldReconnect) {
          console.log(
            "🔄 Mencoba reconnect..."
          );

          await startWhatsApp();
        } else {
          console.log(
            "🚪 Session logout. Scan QR ulang diperlukan."
          );
        }
      }
    }
  );
}

startHttpServer();

startWhatsApp().catch((error) => {
  console.error(
    "❌ WhatsApp gateway error:",
    error
  );

  process.exit(1);
});