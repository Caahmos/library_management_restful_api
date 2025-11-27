// controllers/Whatsapp/LogoutWhatsappController.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getClient } from "../../whatsappClient";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class LogoutWhatsappController {
  static async handle(req: Request, res: Response) {
    console.log("Iniciando processo de logout do WhatsApp...");

    // 0. Verificar se há client ativo
    let client;
    try {
      client = getClient();
    } catch (err) {
      console.warn("Nenhuma sessão ativa encontrada.");
      return res.status(400).json({
        type: "error",
        message: "Não existe sessão ativa do WhatsApp.",
      });
    }

    try {
      // 1. Logout do WhatsApp Web (pode falhar se frame já estiver fechado)
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
        // Pequeno delay para garantir fechamento completo
        await sleep(2000);
        console.log("Cliente fechado com sucesso.");
      } catch (closeErr) {
        console.error("Erro ao fechar cliente:", closeErr);
      }

      // 3. Apagar tokens
      const tokensPath = path.join(process.cwd(), "tokens", "biblioteca");
      try {
        if (fs.existsSync(tokensPath)) {
          console.log(`Apagando tokens em: ${tokensPath}`);
          fs.rmSync(tokensPath, { recursive: true, force: true });
          console.log("Tokens apagados com sucesso.");
        } else {
          console.log("Nenhum token encontrado para apagar.");
        }
      } catch (tokenErr) {
        console.error("Erro ao apagar tokens:", tokenErr);
      }

      return res.status(200).json({
        type: "success",
        message: "WhatsApp deslogado, cliente fechado e tokens apagados com sucesso.",
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
