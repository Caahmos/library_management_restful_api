import { Request, Response } from "express";
import { EditFieldRequest } from "../../../model/Member/MemberFieldsDM/EditFieldRequest";
import EditFieldService from "../../../services/Member/MemberFieldsDM/EditFieldService";

class EditFieldController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = req.params.code;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const editFieldData: EditFieldRequest = req.body;

        try{
            const editedField = await EditFieldService.execute(editFieldData, code);
            res.status(201).json({ type: 'success', message: 'Campo de membro atualizado com sucesso!', editedField });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default EditFieldController;