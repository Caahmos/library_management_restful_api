import * as wppconnect from '@wppconnect-team/wppconnect';

let client: any = null;

export async function startWhatsapp() {
  try {
    const wpp = await wppconnect.create({
      session: 'biblioteca',
      catchQR: (qr) => {
        console.log("\n📱 ESCANEIE O QR CODE PARA CONECTAR O WHATSAPP:\n");
        console.log(qr); // QR aparece no terminal
      },
      statusFind: (status) => {
        console.log("📌 Status WhatsApp:", status);
      },
      headless: true, // roda sem UI do navegador
      puppeteerOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      }
    });

    client = wpp;
    console.log("✅ WhatsApp conectado!");
    return wpp;

  } catch (e) {
    console.error("❌ Erro ao iniciar WhatsApp:", e);
  }
}

export function getClient() {
  if (!client) {
    throw new Error("WhatsApp não está pronto ainda!");
  }
  return client;
}
