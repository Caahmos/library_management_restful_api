import { Request, Response } from "express";
import { DetailHistsRequest, DetailHistsSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import DetailedBalanceService from "../../../services/BiblioReports/DetailedBalanceService";

class DetailedBalanceController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;

        const detailedbalance: DetailHistsSearch = {};
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        const { bibid, copy_barcode, member_barcode, due, status_cd, limit }: DetailHistsRequest =
              req.query;

        if (status_cd) detailedbalance.status_cd = status_cd;
        if (limit) detailedbalance.limit = limit;

        try{
            const balance = await DetailedBalanceService.execute(detailedbalance);
            res.status(200).json({ type: 'success', message: 'Busca realizada com sucesso!', balance});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err});
        }

    }
}

export default DetailedBalanceController;