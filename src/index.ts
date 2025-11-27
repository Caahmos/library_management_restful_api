import dotenv from "dotenv";
import Server from "./server";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { getWhatsappStatus, startWhatsapp } from "./whatsappClient";

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

// --- EXPORTA IO para o whatsappClient usar ---
export { io };


// --- QUANDO CLIENTE CONECTA ---
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  const status = getWhatsappStatus();

  socket.emit("whatsapp-status", {
    status: status.status,
    message: status.message,
    connected: status.connected,
  });

  if (status.qr) {
    socket.emit("whatsapp-qr", {
      qrCode: status.qr,
      message: "📱 QR Code atual",
    });
  }

  // CLIENTE PEDE PARA INICIAR O WHATSAPP
  socket.on("start-whatsapp", async () => {
    console.log("⚡ Cliente solicitou início do WhatsApp");
    await startWhatsapp(); // Agora não usa callback
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});


// --- START SERVER ---
server.listen(process.env.PORT, () => {
  console.log("O servidor está rodando!");
  console.log(`http://localhost:${process.env.PORT}`);
});
