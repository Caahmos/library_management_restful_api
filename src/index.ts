import dotenv from "dotenv";
import Server from "./server";
dotenv.config();

const server = new Server().app;

server.listen(process.env.PORT, () => {
    console.log('O servidor está rodando!');
    console.log(`http://localhost:${process.env.PORT}`);
});