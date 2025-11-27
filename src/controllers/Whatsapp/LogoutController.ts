// controllers/Whatsapp/LogoutWhatsappController.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getClient, startWhatsapp } from "../../whatsappClient";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class LogoutWhatsappController {
  static async handle(req: Request, res: Response) {
    console.log("Iniciando processo de logout do WhatsApp...");

    const tokensPath = path.join(process.cwd(), "tokens", "biblioteca");

    // ✅ Validação: só permite logout se houver client e token
    let client;
    try {
      client = getClient();
    } catch (err) {
      console.warn("Nenhuma sessão ativa encontrada.");
      return res.status(400).json({
        type: "error",
        message: "Não existe client ativo do WhatsApp para deslogar.",
      });
    }

    if (!fs.existsSync(tokensPath)) {
      console.warn("Nenhum token encontrado.");
      return res.status(400).json({
        type: "error",
        message: "Não existe token de sessão. Logout não é necessário.",
      });
    }

    try {
      // 1. Logout do WhatsApp Web
      try {
        console.log("Executando logout do WhatsApp Web...");
        await client.logout();
        console.log("Logout realizado com sucesso.");
      } catch (logoutErr: any) {
        console.warn("Logout falhou (provavelmente frame já fechado):", logoutErr.message);
      }

      // 2. Fechar navegador/cliente
      try {
        console.log("Fechando cliente/navegador...");
        await client.close();
        await sleep(2000); // garante fechamento completo
        console.log("Cliente fechado com sucesso.");
      } catch (closeErr) {
        console.error("Erro ao fechar cliente:", closeErr);
      }

      // 3. Apagar tokens
      try {
        console.log(`Apagando tokens em: ${tokensPath}`);
        fs.rmSync(tokensPath, { recursive: true, force: true });
        console.log("Tokens apagados com sucesso.");
      } catch (tokenErr) {
        console.error("Erro ao apagar tokens:", tokenErr);
      }

      // 4. Gerar novo QR automaticamente
      console.log("Criando nova sessão e gerando QR...");
      await startWhatsapp((data) => {
        if (data.type === "qr") {
          console.log("📱 Novo QR Code gerado:", data.qrCode);
          res.status(200).json({
            type: "success",
            message: "Logout realizado e novo QR gerado!",
            qrCode: data.qrCode,
          });
        } else if (data.type === "status") {
          console.log("Status do novo client:", data.status);
        } else if (data.type === "error") {
          console.error("Erro ao iniciar novo client:", data.message);
          res.status(500).json({
            type: "error",
            message: "Erro ao criar novo client do WhatsApp.",
          });
        }
      });
    } catch (err) {
      console.error("Erro inesperado ao deslogar WhatsApp:", err);
      return res.status(500).json({
        type: "error",
        message: "Não foi possível encerrar a sessão do WhatsApp.",
      });
    }
  }
}

export default LogoutWhatsappController;