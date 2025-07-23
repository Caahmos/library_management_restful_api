import { Request, Response } from "express";
import DetailClassifyService from "../../../services/Member/MemberClassifyDM/DetailClassifyService";

class DetailClassifyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const classify = await DetailClassifyService.execute(code);
            res.status(200).json({ type: 'success', message: 'Tipo de membro da equipe encontrado com sucesso!', classify});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailClassifyController;