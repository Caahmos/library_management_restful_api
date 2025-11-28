// controllers/Whatsapp/LogoutWhatsappController.ts
import { Request, Response } from "express";
import { getClient, startWhatsapp } from "../../whatsappClient";

class LogoutWhatsappController {
  static async handle(req: Request, res: Response) {
    console.log("Iniciando processo de logout do WhatsApp...");

    // ✅ Validação: só permite logout se houver client
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

    try {
      // 1. Logout do WhatsApp Web
      try {
        console.log("Executando logout do WhatsApp Web...");
        await client.logout();
        console.log("Logout realizado com sucesso.");
      } catch (logoutErr: any) {
        console.warn(
          "Logout falhou (provavelmente frame já fechado):",
          logoutErr.message
        );
      }

      // 2. Fechar navegador/cliente
      try {
        console.log("Fechando cliente/navegador...");
        await client.close();
        console.log("Cliente fechado com sucesso.");
      } catch (closeErr) {
        console.error("Erro ao fechar cliente:", closeErr);
      }

      // 3. Gerar novo QR automaticamente
      console.log("Criando nova sessão e gerando QR...");
      await startWhatsapp(); // já emite QR via socket

      return res.status(200).json({
        type: "success",
        message: "Logout realizado! Novo QR será gerado automaticamente.",
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
