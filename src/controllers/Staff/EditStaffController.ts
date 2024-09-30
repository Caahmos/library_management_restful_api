import { Request, Response } from "express";
import { EditStaffRequest } from "../../model/Staff/EditStaffRequest";
import EditStaffService from "../../services/Staff/EditStaffService";

class EditStaffController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const userToEdit = Number(req.params.userid);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const editStaffData: EditStaffRequest = req.body;

        editStaffData.last_change_userid = userId;
        editStaffData.userid = userToEdit;

        if(editStaffData.password) return res.status(422).json({ type: 'error', message: 'Não é possível alterar a senha nesse formulário!'});
        if(editStaffData.confirmPassword) return res.status(422).json({ type: 'error', message: 'Não é possível alterar a senha nesse formulário!'});

        try{
            const editedStaff = await EditStaffService.execute(editStaffData);
            res.status(201).json({ type: 'success', message: 'Membro da equipe atualizado com sucesso!', editedStaff });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default EditStaffController;