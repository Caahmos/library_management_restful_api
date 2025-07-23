import { Request, Response } from "express";
import DeleteClassifyService from "../../../services/Member/MemberClassifyDM/DeleteClassifyService";

class DeleteClassifyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteClassifyService.execute(code);
            res.status(201).json({ type: 'success', message: 'Tipo de usuário deletado com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteClassifyController;