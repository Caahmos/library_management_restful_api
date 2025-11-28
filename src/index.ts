import dotenv from "dotenv";
import Server from "./server";
import http from "http";
import { Server as SocketServer } from "socket.io";
import {
  getWhatsappStatus,
  startWhatsapp,
  hasWhatsappClient,
} from "./whatsappClient";

dotenv.config();

const app = new Server().app;
const server = http.createServer(app);

// --- SOCKET.IO ---
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// --- EXPORTA IO para o whatsappClient ---
export { io };

// --- CONEXÃO DO SOCKET ---
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // --- LISTENERS PRIMEIRO ---
  socket.on("request-whatsapp-state", () => {
    console.log("🔁 Cliente pediu estado atual do WhatsApp");

    const status = getWhatsappStatus();

    socket.emit("whatsapp-status", {
      status: status.status,
      message: status.message,
      connected: status.connected,
    });

    if (!status.connected && status.qr) {
      socket.emit("whatsapp-qr", {
        qrCode: status.qr,
        message: "📱 QR Code atual",
      });
    }
  });

  socket.on("start-whatsapp", async () => {
    console.log("⚡ Cliente solicitou início do WhatsApp");

    if (hasWhatsappClient()) {
      console.log("⚠️ WhatsApp já está rodando. Não vou criar outro.");
      return;
    }

    await startWhatsapp();
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });

  // --- SÓ DEPOIS DISSO MANDA O ESTADO ---
  setTimeout(() => {
    const status = getWhatsappStatus();

    socket.emit("whatsapp-status", {
      status: status.status,
      message: status.message,
      connected: status.connected,
    });

    if (!status.connected && status.qr) {
      socket.emit("whatsapp-qr", {
        qrCode: status.qr,
        message: "📱 QR Code atual",
      });
    }
  }, 300);
});

// --- START SERVER ---
server.listen(process.env.PORT, () => {
  console.log("O servidor está rodando!");
  console.log(`http://localhost:${process.env.PORT}`);
});
