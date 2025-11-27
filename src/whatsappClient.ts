import * as wppconnect from "@wppconnect-team/wppconnect";
import { io } from ".";

let client: any = null;
let lastStatus: string | null = null;
let lastQr: string | null = null;

export async function startWhatsapp() {
  try {
    const wpp = await wppconnect.create({
      session: "biblioteca",
      autoClose: 0,

      // --- QR CODE GERADO ---
      catchQR: (qr) => {
        lastQr = qr;

        const msg = "📱 QR Code gerado! Escaneie no app";
        console.log(msg);

        // Envia para TODOS os sockets
        io.emit("whatsapp-qr", {
          qrCode: qr,
          message: msg
        });
      },

      // --- STATUS DO WHATSAPP ---
      statusFind: (status) => {
        lastStatus = status;

        let message = "";

        switch (status) {
          case "inChat":
          case "isLogged":
            message = "✅ WhatsApp conectado";
            break;
          case "notLogged":
            message = "📲 Aguardando login...";
            break;
          case "qrReadSuccess":
            message = "📱 QR Code lido!";
            break;
          case "qrReadFail":
            message = "❌ Falha ao ler QR Code!";
            break;
          case "disconnectedMobile":
            message = "❌ Dispositivo desconectado!";
            break;
          case "serverClose":
            message = "⚠️ Servidor encerrado";
            break;
          default:
            message = `ℹ️ Status WhatsApp: ${status}`;
        }

        console.log(message);

        // Envia pra todos
        io.emit("whatsapp-status", {
          status,
          message,
          connected: status === "inChat" || status === "isLogged"
        });
      },

      headless: true,
      puppeteerOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    client = wpp;

    console.log("🎉 Sessão criada com sucesso!");

    // Envia conexão inicial
    io.emit("whatsapp-status", {
      status: "CONNECTED",
      message: "🎉 WhatsApp conectado",
      connected: true
    });

    return wpp;

  } catch (e: any) {
    console.error("❌ Erro ao iniciar WhatsApp:", e);

    io.emit("whatsapp-error", {
      message: e.message
    });
  }
}


// --- STATUS GLOBAL PARA QUANDO UM CLIENTE ENTRA ---
export function getWhatsappStatus() {
  if (!client) {
    return {
      connected: false,
      status: lastStatus,
      message: "⚠️ Sem cliente ativo",
      qr: lastQr
    };
  }

  const isConnected = client.isConnected ? client.isConnected() : false;

  return {
    connected: isConnected,
    status: lastStatus,
    qr: lastQr,
    message: isConnected
      ? "✅ WhatsApp conectado"
      : lastStatus === "disconnectedMobile"
      ? "❌ Dispositivo desconectado"
      : "⚠️ Cliente iniciado, mas não conectado",
  };
}

export function getClient() {
  if (!client) {
    throw new Error("WhatsApp não está pronto ainda!");
  }
  return client;
}
