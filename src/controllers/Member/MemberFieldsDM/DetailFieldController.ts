import { Request, Response } from "express";
import DetailFieldService from "../../../services/Member/MemberFieldsDM/DetailFieldService";

class DetailFieldController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = req.params.code;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const field = await DetailFieldService.execute(code);
            res.status(200).json({ type: 'success', message: 'Campo de membro encontrado com sucesso!', field});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailFieldController;