import { Request, Response } from "express";
import DeleteMaterialService from "../../services/Material/DeleteMaterialService";

class DeleteMaterialController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteMaterialService.execute(code);
            res.status(201).json({ type: 'success', message: 'Material deletado com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteMaterialController;