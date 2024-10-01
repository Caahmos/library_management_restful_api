import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import cors from "cors";
import StaffRoutes from "./routes/StaffRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../swagger.json';
import MemberClassifyDM from "./routes/MemberClassifyDM";
import MemberFieldsDM from "./routes/MemberFieldsDM";
dotenv.config();

class Server {
  public app = express();

  constructor() {
    this.configServer();
    this.configRoutes();
  }

  configServer() {
    this.configBodyParser();
    this.configCors();
  }

  configBodyParser() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.resolve("src", "public", "assets")));
  }

  configRoutes() {
    this.app.use("/staff", new StaffRoutes().router);
    this.app.use("/mbrclassifydm", new MemberClassifyDM().router);
    this.app.use("/mbrfieldsdm", new MemberFieldsDM().router);
    this.documentation();
  }

  configCors() {
    this.app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  }

  documentation() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default Server;
