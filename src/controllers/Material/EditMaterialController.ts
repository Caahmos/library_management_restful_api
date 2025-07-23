import { Request, Response } from "express";
import { EditMaterialRequest } from "../../model/Material/EditMaterialRequest";
import EditMaterialService from "../../services/Material/EditMaterialService";

class EditMaterialController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const editMaterialData: EditMaterialRequest = req.body;

        if(req.file){
            editMaterialData.image_file = req.file.filename
        }

        try{
            const editedMaterial = await EditMaterialService.execute(editMaterialData, code);
            res.status(201).json({ type: 'success', message: 'Material atualizado com sucesso!', editedMaterial });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default EditMaterialController;