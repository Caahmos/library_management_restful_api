import { Request, Response } from "express";
import DeleteCopyService from "../../../services/Biblio/BiblioCopy/DeleteCopyService";

class DeleteCopyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const id = Number(req.params.id);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteCopyService.execute(id);
            res.status(201).json({ type: 'success', message: 'Cópia bibliográfica deletada com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteCopyController;