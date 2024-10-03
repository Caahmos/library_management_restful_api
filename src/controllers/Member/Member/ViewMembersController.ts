import { Request, Response } from "express";
import ViewMembersService from "../../../services/Member/Member/ViewMembersService";

class ViewMembersController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const members = await ViewMembersService.execute();
            res.status(201).json({ type: 'success', message: 'Membros encontrados com sucesso!', members });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewMembersController;