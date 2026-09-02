import type { WASocket } from "@whiskeysockets/baileys";

let socket: WASocket | null = null;
let connected = false;

export function setWhatsAppSocket(
  newSocket: WASocket
) {
  socket = newSocket;
}

export function setWhatsAppConnected(
  value: boolean
) {
  connected = value;
}

export function isWhatsAppConnected() {
  return connected;
}

export async function sendText(
  phone: string,
  message: string
) {
  if (!socket || !connected) {
    throw new Error(
      "WhatsApp belum terhubung"
    );
  }

  const normalizedPhone = phone
    .replace(/\D/g, "");

  if (
    !/^\d{8,15}$/.test(normalizedPhone)
  ) {
    throw new Error(
      "Nomor WhatsApp tidak valid"
    );
  }

  return socket.sendMessage(
    `${normalizedPhone}@s.whatsapp.net`,
    {
      text: message,
    }
  );
}

export async function sendImage(
  phone: string,
  image: Buffer,
  caption?: string
) {
  if (!socket || !connected) {
    throw new Error(
      "WhatsApp belum terhubung"
    );
  }

  const normalizedPhone = phone
    .replace(/\D/g, "");

  if (
    !/^\d{8,15}$/.test(normalizedPhone)
  ) {
    throw new Error(
      "Nomor WhatsApp tidak valid"
    );
  }

  return socket.sendMessage(
    `${normalizedPhone}@s.whatsapp.net`,
    {
      image,
      caption,
    }
  );
}