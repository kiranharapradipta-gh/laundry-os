import QRCode from "qrcode";

export async function generateQRCodeImage(
  token: string
) {
  return QRCode.toBuffer(token, {
    type: "png",
    width: 800,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}