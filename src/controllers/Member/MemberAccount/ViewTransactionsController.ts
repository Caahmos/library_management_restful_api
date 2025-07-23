import { Request, Response } from "express";
import ViewTransactionsService from "../../../services/Member/MemberAccount/ViewTransactionsService";

class ViewTransactionsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const mbrid: number | undefined = Number(req.query.mbrid)

        try{
            const transactions = await ViewTransactionsService.execute(mbrid);
            res.status(200).json({ type: 'success', message: 'Transações encontradas com sucesso!', transactions});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewTransactionsController;