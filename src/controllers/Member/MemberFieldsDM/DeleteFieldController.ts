import { Request, Response } from "express";
import DeleteFieldService from "../../../services/Member/MemberFieldsDM/DeleteFieldService";

class DeleteFieldController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = req.params.code;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteFieldService.execute(code);
            res.status(201).json({ type: 'success', message: 'Campo de usuário deletado com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteFieldController;