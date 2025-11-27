import dotenv from "dotenv";
import Server from "./server";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { getWhatsappStatus, startWhatsapp } from "./whatsappClient";
dotenv.config();

const app = new Server().app;
const server = http.createServer(app);

// Configurando Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Evento quando um cliente se conecta via WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Pega o status atual e o último QR
  const status = getWhatsappStatus();

  // Envia status e QR para o cliente que acabou de se conectar
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

  // Evento para iniciar WhatsApp
  socket.on("start-whatsapp", async () => {
    await startWhatsapp((data) => {
      if (data.type === "qr") {
        socket.emit("whatsapp-qr", data); // envia QR
      } else if (data.type === "status") {
        socket.emit("whatsapp-status", data); // envia status
      } else if (data.type === "error") {
        socket.emit("whatsapp-error", data); // envia erro
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Start do servidor
server.listen(process.env.PORT, () => {
  console.log("O servidor está rodando!");
  console.log(`http://localhost:${process.env.PORT}`);
});

// Exportar io para usar em outros arquivos
export { io };
