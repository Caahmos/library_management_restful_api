import { Request, Response } from "express";
import ViewCheckPrivsService from "../../services/CheckoutPrivs/ViewCheckPrivsService";

class ViewCheckPrivsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const checkprivs = await ViewCheckPrivsService.execute();
            res.status(200).json({ type: 'success', message: 'Informações de permanência dos materiais por tipo de usuário encontradas com sucesso!', checkprivs});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewCheckPrivsController;