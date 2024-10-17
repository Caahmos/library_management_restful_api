import { Request, Response } from "express";
import { ViewHistRequest, ViewHistSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import ViewHoldService from "../../../services/Biblio/BiblioStatusHist/ViewHoldsService";

class ViewHoldsController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    if (!userroles.admin_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    const { bibid, mbrid }: ViewHistRequest = req.query;

    const viewHoldData: ViewHistSearch = {};

    if(bibid) viewHoldData.bibid = Number(bibid);
    if(mbrid) viewHoldData.mbrid = Number(mbrid);

    if(!bibid && !mbrid) return res.status(422).json({ type: "error", message: 'Nada a ser procurado!' });

    try {
      const foundHist = await ViewHoldService.execute(viewHoldData);
      res
        .status(200)
        .json({
          type: "success",
          message: "'Histórico de reservas encontrado com sucesso!'",
          foundHist,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default ViewHoldsController;
