import { Request, Response } from "express";
import MemberRanksService from "../../../services/BiblioReports/MemberRanksService";

class MemberRanksController {
  static async handle(req: Request, res: Response) {
    try {
      const collection_cd = req.query.collection_cd
        ? Number(req.query.collection_cd)
        : undefined;

      const mbrid = req.query.mbrid
        ? Number(req.query.mbrid)
        : undefined;

      const limit = req.query.limit
        ? Number(req.query.limit)
        : undefined;

      const ranks = await MemberRanksService.execute(collection_cd, mbrid, limit);
      return res.status(200).json({ type: 'success', message: 'Ranks encontrados com sucesso!', ranks });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ type: 'error', message: err });
    }
  }
}

export default MemberRanksController;