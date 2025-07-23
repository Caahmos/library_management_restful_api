import { Request, Response } from "express";
import ViewHistService from "../../../services/Biblio/BiblioStatusHist/ViewHistService";
import { ViewHistRequest, ViewHistSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";

class ViewHistController {
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

    const { bibid, mbrid }: ViewHistRequest = req.query;

    const viewHistData: ViewHistSearch = {};

    if(bibid) viewHistData.bibid = Number(bibid);
    if(mbrid) viewHistData.mbrid = Number(mbrid);

    if(!bibid && !mbrid) return res.status(422).json({ type: "error", message: 'Nada a ser procurado!' });

    try {
      const foundHist = await ViewHistService.execute(viewHistData);
      res
        .status(200)
        .json({
          type: "success",
          message: "Histórico encontrado com sucesso!",
          foundHist,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default ViewHistController;
