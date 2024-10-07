import { Request, Response } from "express";
import ViewCollectionsService from "../../services/Collection/ViewCollectionsService";

class ViewCollectionsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const collections = await ViewCollectionsService.execute();
            res.status(200).json({ type: 'success', message: 'Coleções encontrados com sucesso!', collections});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewCollectionsController;