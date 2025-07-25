import { Request, Response } from "express";
import {
  ViewHistsRequest,
  ViewHistsSearch,
} from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import ViewHistsService from "../../../services/Biblio/BiblioStatusHist/ViewHistsService";

class ViewHistsController {
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

    const { bibid, copyid, mbrid, due, status_cd, limit }: ViewHistsRequest =
      req.query;

    const viewHistsData: ViewHistsSearch = {};

    if (bibid) viewHistsData.bibid = Number(bibid);
    if (copyid) viewHistsData.copyid = Number(copyid);
    if (mbrid) viewHistsData.mbrid = Number(mbrid);
    if (due) viewHistsData.due = due;
    if (status_cd) viewHistsData.status_cd = status_cd;
    if (limit) viewHistsData.limit = Number(limit);

    if (!copyid && !mbrid && !due && !status_cd && !bibid)
      return res
        .status(422)
        .json({ type: "error", message: "Nada a ser procurado!" });

    try {
      const foundHists = await ViewHistsService.execute(viewHistsData);
      res.status(200).json({
        type: "success",
        message: "'Histórico encontrado com sucesso!'",
        foundHists,
      });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default ViewHistsController;
