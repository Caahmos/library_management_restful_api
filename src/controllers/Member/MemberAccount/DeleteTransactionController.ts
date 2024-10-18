import { Request, Response } from "express";
import DeleteTransactionService from "../../../services/Member/MemberAccount/DeleteTransactionService";

class DeleteTransactionController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const id = Number(req.params.id);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteTransactionService.execute(id);
            res.status(201).json({ type: 'success', message: 'Transação deletada com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteTransactionController;