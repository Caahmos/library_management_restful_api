import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import cors from "cors";
dotenv.config();

class Server {
  public app = express();

  constructor() {
    this.configServer();
    this.configRoutes();
  }

  configServer(){
    this.configBodyParser();
    this.configCors();
  }

  configBodyParser() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.resolve("src", "public", "assets")));
  }

  configRoutes() {

  }

  configCors() {
    this.app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  }

  documentation(){

  }
}

export default Server;
