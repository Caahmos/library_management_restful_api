import * as wppconnect from "@wppconnect-team/wppconnect";

let client: any = null;
let lastStatus: string | null = null; // guarda o último status do statusFind
let lastQr: string | null = null; // guarda o último QR gerado

export async function startWhatsapp(callback?: (data: any) => void) {
  try {
    const wpp = await wppconnect.create({
      session: "biblioteca",
      autoClose: 0,
      catchQR: (qr) => {
        lastQr = qr; // salva o último QR
        const msg = "📱 QR Code gerado! Escaneie no app";
        console.log(msg, qr);
        if (callback) callback({ type: "qr", qrCode: qr, message: msg });
      },
      statusFind: (status) => {
        lastStatus = status; // salva o status atual
        let message = "";

        switch (status) {
          case "inChat":
          case "isLogged":
            message = "✅ WhatsApp conectado e pronto para enviar mensagens " + status;
            break;
          case "notLogged":
            message = "📲 Aguardando login... " + status;
            break;
          case "qrReadSuccess":
            message = "📱 QR Code lido com sucesso! " + status;
            break;
          case "qrReadFail":
            message = "❌ Falha ao ler QR Code! " + status;
            break;
          case "disconnectedMobile":
            message = "❌ Dispositivo desconectado do WhatsApp! " + status;
            break;
          case "serverClose":
            message = "⚠️ Servidor do WhatsApp fechado " + status;
            break;
          default:
            message = `ℹ️ Status WhatsApp: ${status}`;
        }

        console.log(message);
        if (callback) callback({ type: "status", status, message });
      },
      headless: true,
      puppeteerOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    client = wpp;
    console.log("🎉 Sessão do WhatsApp criada com sucesso!");
    if (callback)
      callback({
        type: "status",
        status: "CONNECTED",
        message: "🎉 WhatsApp conectado",
      });

    return wpp;
  } catch (e: any) {
    console.error("❌ Erro ao iniciar WhatsApp:", e);
    if (callback) callback({ type: "error", message: e.message });
  }
}

// Retorna o status atual + último QR
export function getWhatsappStatus() {
  if (!client) {
    return { connected: false, status: null, message: "⚠️ Sem cliente ativo", qr: lastQr };
  }

  const isConnected = client.isConnected ? client.isConnected() : false;

  return {
    connected: isConnected,
    status: lastStatus,
    qr: lastQr, // último QR disponível
    message: isConnected
      ? "✅ WhatsApp conectado"
      : lastStatus === "disconnectedMobile"
      ? "❌ Dispositivo desconectado do WhatsApp"
      : "⚠️ Cliente iniciado, mas não conectado",
  };
}

export function getClient() {
  if (!client) {
    throw new Error("WhatsApp não está pronto ainda!");
  }
  return client;
}
