import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import cors from "cors";
import StaffRoutes from "./routes/StaffRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../swagger.json';
import MemberClassifyDMRoutes from "./routes/MemberClassifyDMRoutes";
import MemberFieldsDMRoutes from "./routes/MemberFieldsDMRoutes";
import MemberRoutes from "./routes/MemberRoutes";
import MaterialRoutes from "./routes/MaterialRoutes";
import CollectionRoutes from "./routes/CollectionRoutes";
import BiblioRoutes from "./routes/BiblioRoutes";
import BiblioCopyRoutes from "./routes/BiblioCopyRoutes";
import CheckoutPrivsRoutes from "./routes/CheckoutPrivsRoutes";
import BiblioHistRoutes from "./routes/BiblioHistRoutes";
import MemberAccountRoutes from "./routes/MemberAccount";
import BiblioRankRoutes from "./routes/BiblioRankRoutes";
import BiblioReportsRoutes from "./routes/BiblioReportsRoutes";
import MarcRoutes from "./routes/MarcRoutes";
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
    this.app.use("/member", new MemberRoutes().router);
    this.app.use("/biblio", new BiblioRoutes().router);
    this.app.use("/bibliocopy", new BiblioCopyRoutes().router);
    this.app.use("/bibliohist", new BiblioHistRoutes().router);
    this.app.use("/bibliorank", new BiblioRankRoutes().router);
    this.app.use("/checkprivs", new CheckoutPrivsRoutes().router);
    this.app.use("/material", new MaterialRoutes().router);
    this.app.use("/collection", new CollectionRoutes().router);
    this.app.use("/mbrclassifydm", new MemberClassifyDMRoutes().router);
    this.app.use("/mbrfieldsdm", new MemberFieldsDMRoutes().router);
    this.app.use("/mbraccount", new MemberAccountRoutes().router);
    this.app.use("/biblioreports", new BiblioReportsRoutes().router);
    this.app.use("/marc", new MarcRoutes().router);
    this.documentation();
  }

  configCors() {
    this.app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
  }

  documentation() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

import './utils/BlockOverdueMembers';

export default Server;
