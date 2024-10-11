import { Request, Response } from "express";
import DeleteBiblioService from "../../../services/Biblio/Biblio/DeleteBiblioService";

class DeleteBiblioController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const bibid = Number(req.params.bibid);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteBiblioService.execute(bibid);
            res.status(201).json({ type: 'success', message: 'Bibliografia deletada com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteBiblioController;