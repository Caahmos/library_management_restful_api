import { Request, Response } from "express";
import { SearchBibliosRequest } from "../../../model/Biblio/Biblio/SearchBibliosRequest";
import RandomSearchService from "../../../services/Biblio/Biblio/RandomSearchService";

class RandomSearchController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    // if (!userroles.admin_flg)
    //   return res
    //     .status(422)
    //     .json({ type: "error", message: "Usuário não tem permissão!" });
    // if (!userroles.catalog_flg)
    //   return res
    //     .status(422)
    //     .json({ type: "error", message: "Usuário não tem permissão!" });

    const method = req.query.method as "title" | "author" | "collection";
    const number = Number(req.query.number);

    try {
      const biblios = await RandomSearchService.execute(method, number);
      res
        .status(200)
        .json({
          type: "success",
          message: "Bibliografias encontradas com sucesso!",
          biblios
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default RandomSearchController;
