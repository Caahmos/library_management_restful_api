import { Request, Response } from "express";
import ViewFieldsService from "../../../services/Member/MemberFieldsDM/ViewFieldsService";

class ViewFieldsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const fields = await ViewFieldsService.execute();
            res.status(200).json({ type: 'success', message: 'Campos de membros encontrados com sucesso!', fields});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewFieldsController;