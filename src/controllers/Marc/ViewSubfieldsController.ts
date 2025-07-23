import { Request, Response } from "express";
import ViewSubfieldsService from "../../services/Marc/ViewSubfieldsService";

class ViewSubfieldsController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;
    const query = req.query

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    if (!userroles.catalog_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    try {
      const subfields = await ViewSubfieldsService.execute(query);
      res
        .status(200)
        .json({
          type: "success",
          message: "Subcampos encontrados com sucesso!",
          subfields,
        });
    } catch (err: any) {
        res.status(422).json({ type: 'error', message: err})
    };
  };
};

export default ViewSubfieldsController;
