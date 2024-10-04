import { Request, Response } from "express";
import ViewMaterialsService from "../../services/Material/ViewMaterialService";

class ViewMaterialController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const materials = await ViewMaterialsService.execute();
            res.status(200).json({ type: 'success', message: 'Materiais encontrados com sucesso!', materials});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewMaterialController;