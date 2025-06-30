import { Request, Response } from "express";
import SearchBibliosService from "../../../services/Biblio/Biblio/SearchBibliosService";
import { SearchBibliosRequest } from "../../../model/Biblio/Biblio/SearchBibliosRequest";

class SearchBibliosController {
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
    const data = req.query.data as string;

    const searchData: SearchBibliosRequest = {
        method: method || 'title',
        data: data
    };

    try {
      const biblios = await SearchBibliosService.execute(searchData);
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

export default SearchBibliosController;
