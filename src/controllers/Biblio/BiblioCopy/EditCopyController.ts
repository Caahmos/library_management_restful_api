import { Request, Response } from "express";
import { EditCopyRequest } from "../../../model/Biblio/BiblioCopy/EditCopyRequest";
import EditCopyService from "../../../services/Biblio/BiblioCopy/EditCopyService";

class EditCopyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const id = Number(req.params.id);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const editCopyData: EditCopyRequest = req.body;

        if(Object.keys(editCopyData).length <= 0) return res.status(422).json({ type: 'error', message: 'Nada a ser editado!'});

        try{
            const editedCopy = await EditCopyService.execute(editCopyData, id);
            res.status(201).json({ type: 'success', message: 'Copia da bibliografia atualizada com sucesso!', editedCopy });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default EditCopyController;