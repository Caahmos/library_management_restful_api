import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { startWhatsapp, getWhatsappStatus } from "../../whatsappClient";

class RefreshQrController {
  static async handle(req: Request, res: Response) {
    console.log("Solicitação de refresh do QR Code...");

    const statusInfo = getWhatsappStatus();
    console.log("Status atual:", statusInfo.status);

    if (
      statusInfo.connected &&
      statusInfo.status !== "disconnectedMobile" &&
      statusInfo.status !== "qrReadFail"
    ) {
      return res.status(400).json({
        type: "error",
        message:
          "Não é possível gerar novo QR Code. Só é permitido se estiver desconectado ou com erro no QR.",
        currentStatus: statusInfo,
      });
    }

    try {
      const sessionName = "biblioteca";
      const sessionPath = path.join(process.cwd(), "tokens", sessionName);

      if (fs.existsSync(sessionPath)) {
        console.log("Removendo sessão antiga...");
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }

      console.log("Iniciando nova sessão do WhatsApp...");
      await startWhatsapp();

      return res.status(200).json({
        type: "success",
        message:
          "Nova sessão iniciada. O QR Code será enviado via socket.io.",
      });
    } catch (err) {
      console.error("Erro ao gerar novo QR Code:", err);
      return res.status(500).json({
        type: "error",
        message: "Não foi possível gerar QR Code do WhatsApp.",
      });
    }
  }
}

export default RefreshQrController;
