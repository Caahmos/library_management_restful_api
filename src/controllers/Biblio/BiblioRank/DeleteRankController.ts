import { Request, Response } from "express";
import DeleteRankService from "../../../services/Biblio/BiblioRank/DeleteRankService";

class DeleteRankController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const id = Number(req.params.id);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteRankService.execute(id);
            res.status(201).json({ type: 'success', message: 'Rank da bibliográfica deletado com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteRankController;