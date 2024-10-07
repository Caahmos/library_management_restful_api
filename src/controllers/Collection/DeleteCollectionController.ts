import { Request, Response } from "express";
import DeleteCollectionService from "../../services/Collection/DeleteCollectionService";

class DeleteCollectionController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteCollectionService.execute(code);
            res.status(201).json({ type: 'success', message: 'Coleção deletada com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteCollectionController;