import { Request, Response } from "express";
import { RegisterBiblioRequest } from "../../../model/Biblio/Biblio/RegisterBiblioRequest";
import RegisterBiblioService from "../../../services/Biblio/Biblio/RegisterBiblioService";

class RegisterBiblioController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId) {
      return res.status(422).json({ type: "error", message: "Usuário não autenticado!" });
    }
    if (!userroles?.catalog_flg) {
      return res.status(422).json({ type: "error", message: "Usuário não tem permissão!" });
    }

    const biblioData: RegisterBiblioRequest = req.body;
    biblioData.last_change_userid = userId;

    try {
      const registeredBibliography = await RegisterBiblioService.execute(biblioData);

      return res.status(201).json({
        type: "success",
        message: "Bibliografia registrada com sucesso!",
        registeredBibliography,
      });
    } catch (err: any) {
      return res.status(422).json({
        type: "error",
        message: err.message || "Erro ao registrar bibliografia.",
      });
    }
  }
}

export default RegisterBiblioController;
