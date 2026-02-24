import { Request, Response } from "express";
import { RegisterCollectionRequest } from "../../model/Collection/RegisterCollectionRequest";
import RegisterCollectionService from "../../services/Collection/RegisterCollectionService";

class RegisterCollectionController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const collectionData: RegisterCollectionRequest = req.body;

        if(!collectionData.description) return res.status(422).json({ type: 'error', message: 'Informe a descrição!'});

        try{
            const registeredCollection = await RegisterCollectionService.execute(collectionData);
            res.status(201).json({ type: 'success', message: 'Coleção cadastrada com sucesso!', registeredCollection });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    };
};

export default RegisterCollectionController;