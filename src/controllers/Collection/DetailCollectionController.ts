import { Request, Response } from "express";
import DetailCollectionService from "../../services/Collection/DetailCollectionService";

class DetailCollectionController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const collection = await DetailCollectionService.execute(code);
            res.status(200).json({ type: 'success', message: 'Coleção encontrado com sucesso!', collection});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailCollectionController;