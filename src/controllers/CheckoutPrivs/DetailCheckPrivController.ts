import { Request, Response } from "express";
import DetailCollectionService from "../../services/Collection/DetailCollectionService";
import DetailCheckPrivsService from "../../services/CheckoutPrivs/DetailCheckPrivsService";

class DetailCheckPrivsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const id = Number(req.params.id);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const checkpriv = await DetailCheckPrivsService.execute(id);
            res.status(200).json({ type: 'success', message: 'Informação de permanência dos materiais por tipo de usuário encontrada com sucesso!', checkpriv});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailCheckPrivsController;