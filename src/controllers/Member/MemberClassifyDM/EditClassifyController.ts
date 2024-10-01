import { Request, Response } from "express";
import { EditClassifyRequest } from "../../../model/Member/MemberClassifyDM/EditClassifyRequest";
import EditClassifyService from "../../../services/Member/MemberClassifyDM/EditClassifyService";

class EditClassifyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const editClassifyData: EditClassifyRequest = req.body;

        editClassifyData.code = code;

        try{
            const editedClassify = await EditClassifyService.execute(editClassifyData);
            res.status(201).json({ type: 'success', message: 'Tipo de membro atualizado com sucesso!', editedClassify });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default EditClassifyController;