import { Request, Response } from "express";
import DeleteMemberService from "../../../services/Member/Member/DeleteMemberService";

class DeleteMemberController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const mbrid = Number(req.params.mbrid);
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            await DeleteMemberService.execute(mbrid);
            res.status(201).json({ type: 'success', message: 'Usuário deletado com sucesso!' });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    }
}

export default DeleteMemberController;