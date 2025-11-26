import { Request, Response } from "express";
import OverdueHistsService from "../../../services/Biblio/BiblioStatusHist/OverdueHistsService";

class OverdueHistsController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });

    if (!userroles.circ_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    // 🔥 novo parâmetro (asc | desc)
    const order = req.query.order === "desc" ? "desc" : "asc";

    try {
      const result = await OverdueHistsService.execute(limit, order);

      return res.status(200).json({
        type: "success",
        message: "Itens atrasados encontrados com sucesso!",
        items: result,
      });
    } catch (err: any) {
      return res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default OverdueHistsController;
