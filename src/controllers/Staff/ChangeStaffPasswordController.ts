import { Request, Response } from "express";
import { ChangeStaffPasswordRequest } from "../../model/Staff/ChangeStaffPasswordRequest";
import ChangeStaffPasswordService from "../../services/Staff/ChangeStaffPasswordService";

class ChangeStaffPasswordController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const userToEdit = Number(req.params.userid);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
            
        const changePasswordData: ChangeStaffPasswordRequest = req.body;

        changePasswordData.last_change_userid = userId;
        changePasswordData.userid = userToEdit;

        if(!changePasswordData.password) return res.status(422).json({ type: 'error', message: 'Informe a nova senha!'});
        if(!changePasswordData.confirmPassword) return res.status(422).json({ type: 'error', message: 'Repita a nova senha!'});

        try{
            await ChangeStaffPasswordService.execute(changePasswordData);
            res.status(201).json({ type: 'success', message: 'Senha alterada com sucesso!!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    }
};

export default ChangeStaffPasswordController;