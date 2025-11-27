// controllers/Whatsapp/RefreshQrController.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { startWhatsapp, getWhatsappStatus } from "../../whatsappClient";

class RefreshQrController {
  static async handle(req: Request, res: Response) {
    console.log("Solicitação de refresh do QR Code...");

    const statusInfo = getWhatsappStatus();
    console.log("Status atual:", statusInfo.status);

    // Permite gerar QR apenas se não houver cliente ativo ou se desconectado
    if (
      statusInfo.connected &&
      statusInfo.status !== "disconnectedMobile" &&
      statusInfo.status !== "qrReadFail"
    ) {
      console.log("Sessão ainda ativa ou não desconectada do mobile.");
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

      // Remover sessão antiga para gerar novo QR
      if (fs.existsSync(sessionPath)) {
        console.log("Removendo sessão antiga para gerar novo QR...");
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }

      console.log("Criando nova sessão do WhatsApp...");
      await startWhatsapp((data) => {
        if (data.type === "qr") {
          // Retornar QR Code para frontend
          res.status(200).json({
            type: "success",
            message: "QR Code gerado com sucesso.",
            qrCode: data.qrCode,
          });
        } else if (data.type === "status") {
          console.log("Status:", data.status);
        } else if (data.type === "error") {
          console.error("Erro no startWhatsapp:", data.message);
        }
      });
    } catch (err: any) {
      console.error("Erro ao gerar novo QR Code:", err);
      return res.status(500).json({
        type: "error",
        message: "Não foi possível gerar QR Code do WhatsApp.",
      });
    }
  }
}

export default RefreshQrController;
