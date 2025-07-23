import { Request, Response } from "express";
import { EditCollectionRequest } from "../../model/Collection/EditCollectionRequest";
import EditCollectionService from "../../services/Collection/EditCollectionService";

class EditCollectionController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const editCollectionData: EditCollectionRequest = req.body;

        try{
            const editedCollection = await EditCollectionService.execute(editCollectionData, code);
            res.status(201).json({ type: 'success', message: 'Coleção atualizada com sucesso!', editedCollection });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default EditCollectionController;