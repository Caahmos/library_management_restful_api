import { Request, Response } from "express";
import { DetailedSearchRequest } from "../../../model/Biblio/Biblio/DetailedSearchRequest";
import DetailedSearchService from "../../../services/Biblio/Biblio/DetailedSearchService";

class DetailedSearchController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId) {
      return res.status(401).json({
        type: "error",
        message: "Usuário não autenticado!"
      });
    }

    // if (!userroles.admin_flg && !userroles.catalog_flg) {
    //   return res.status(403).json({
    //     type: "error",
    //     message: "Usuário não tem permissão!"
    //   });
    // }

    const { collection, date, order, take } = req.query as Partial<DetailedSearchRequest>;

    const searchData: DetailedSearchRequest = {
      take: take || 100,
      collection: collection || "",
      date: date || "",
      order: order || ""
    };

    try {
      const biblios = await DetailedSearchService.execute(searchData);

      return res.status(200).json({
        type: "success",
        message: "Bibliografias encontradas com sucesso!",
        biblios
      });
    } catch (err: any) {
      return res.status(500).json({
        type: "error",
        message: err.message || "Erro ao buscar bibliografias."
      });
    }
  }
}

export default DetailedSearchController;
