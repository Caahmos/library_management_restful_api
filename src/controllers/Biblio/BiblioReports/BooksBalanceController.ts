import { Request, Response } from "express";
import BooksBalanceService from "../../../services/BiblioReports/BooksBalanceService";

class BooksBalanceController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const balance = await BooksBalanceService.execute();
            res.status(200).json({ type: 'success', message: 'Busca realizada com sucesso!', balance});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: 'Erro ao realizar a busca!'});
        }

    }
}

export default BooksBalanceController;