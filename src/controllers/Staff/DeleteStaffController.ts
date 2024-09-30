import { Request, Response } from "express";
import DeleteStaffService from "../../services/Staff/DeleteStaffService";

class DeleteStaffController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const userToDelete = Number(req.params.userid);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteStaffService.execute(userToDelete);
            res.status(201).json({ type: 'success', message: 'Usuário deletado com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteStaffController;