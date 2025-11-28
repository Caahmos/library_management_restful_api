import * as wppconnect from "@wppconnect-team/wppconnect";
import { io } from ".";

// --- Estado global do WhatsApp ---
interface WhatsappState {
  client: any | null;
  lastStatus: string | null;
  lastQr: string | null;
}

const whatsappState: WhatsappState = {
  client: null,
  lastStatus: null,
  lastQr: null,
};

// --- Inicia o WhatsApp ---
export async function startWhatsapp() {
  try {
    const wpp = await wppconnect.create({
      session: "biblioteca",
      autoClose: 0,

      // QR CODE GERADO
      catchQR: (qr) => {
        whatsappState.lastQr = qr;

        const msg = "📱 QR Code gerado! Escaneie no app";
        console.log(msg);

        io.emit("whatsapp-qr", {
          qrCode: qr,
          message: msg,
        });

        io.emit("whatsapp-status", {
          status: "notLogged",
          message: "📲 Aguardando login...",
          connected: false,
        });
      },

      // STATUS DO WHATSAPP
      statusFind: (status) => {
        whatsappState.lastStatus = status;

        let message = "";

        switch (status) {
          case "inChat":
            message = "✅ WhatsApp conectado";
            break;
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
          default:
            message = `ℹ️ Status WhatsApp: ${status}`;
        }

        console.log("STATUS:", status, message);

        io.emit("whatsapp-status", {
          status,
          message,
          connected: status === "inChat" || status === "isLogged",
        });
      },

      headless: true,
      puppeteerOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    whatsappState.client = wpp;

    console.log("🎉 Sessão criada com sucesso!");

    return wpp;
  } catch (e: any) {
    console.error("❌ Erro ao iniciar WhatsApp:", e);

    io.emit("whatsapp-error", {
      message: e.message,
    });
  }
}

// --- Retorna o estado atual do WhatsApp ---
export function getWhatsappStatus() {
  const status = whatsappState.lastStatus;
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
    default:
      message = status
        ? `ℹ️ Status WhatsApp: ${status}`
        : "WhatsApp não iniciado";
  }

  return {
    status,
    qr: whatsappState.lastQr,
    connected: status === "inChat" || status === "isLogged",
    message,
  };
}

// --- Verifica se o client já existe ---
export function hasWhatsappClient() {
  return whatsappState.client !== null;
}

// --- Retorna o client (lança erro se não existir) ---
export function getClient() {
  if (!whatsappState.client) throw new Error("WhatsApp não está pronto ainda!");
  return whatsappState.client;
}
