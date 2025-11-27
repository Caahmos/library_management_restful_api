// controllers/Whatsapp/RefreshQrController.ts
import { Request, Response } from "express";
import * as wppconnect from "@wppconnect-team/wppconnect";
import path from "path";
import fs from "fs";

let client: any = null; // Opcional: armazenar a sessão se quiser reaproveitar

class RefreshQrController {
  static async handle(req: Request, res: Response) {
    console.log("Solicitação de refresh do QR Code...");

    // 1. Verificar se já existe client ativo
    if (client) {
      console.log("Sessão já está ativa.");
      return res.status(400).json({
        type: "error",
        message: "Já existe uma sessão ativa do WhatsApp.",
      });
    }

    try {
      const sessionName = "biblioteca";
      const sessionPath = path.join(process.cwd(), "tokens", sessionName);

      // 2. Se existir pasta de tokens mas client não inicializado, apagamos para gerar novo QR
      if (fs.existsSync(sessionPath)) {
        console.log("Removendo sessão antiga para gerar novo QR...");
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }

      // 3. Criar nova sessão
      console.log("Criando nova sessão do WhatsApp...");
      const wpp = await wppconnect.create({
        session: sessionName,
        catchQR: (qr: string) => {
          console.log("QR Code gerado:");
          console.log(qr); // Pode enviar como base64 ou string
          // Retornar QR Code para frontend
          res.status(200).json({
            type: "success",
            message: "QR Code gerado com sucesso.",
            qrCode: qr,
          });
        },
        statusFind: (status: string) => {
          console.log("Status WhatsApp:", status);
        },
        headless: true,
        puppeteerOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      });

      client = wpp;
      console.log("Sessão do WhatsApp iniciada.");
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
