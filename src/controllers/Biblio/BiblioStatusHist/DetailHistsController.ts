import { Request, Response } from "express";
import {
  DetailHistsRequest,
  DetailHistsSearch,
  ViewHistsSearch,
} from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import DetailHistsService from "../../../services/Biblio/BiblioStatusHist/DetailHistsService";

class DetailHistsController {
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

    const { bibid, copy_barcode, member_barcode, due, status_cd, limit }: DetailHistsRequest =
      req.query;

    const viewHistsData: DetailHistsSearch = {};

    if (bibid) viewHistsData.bibid = Number(bibid);
    if (copy_barcode) viewHistsData.copy_barcode = copy_barcode;
    if (member_barcode) viewHistsData.member_barcode = Number(member_barcode);
    if (due) viewHistsData.due = due;
    if (status_cd) viewHistsData.status_cd = status_cd;
    if (limit) viewHistsData.limit = Number(limit);

    if (!copy_barcode && !member_barcode && !due && !status_cd && !bibid)
      return res
        .status(422)
        .json({ type: "error", message: "Nada a ser procurado!" });

    try {
      const foundHists = await DetailHistsService.execute(viewHistsData);
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

export default DetailHistsController;
