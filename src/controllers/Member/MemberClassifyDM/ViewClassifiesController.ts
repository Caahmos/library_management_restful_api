import { Request, Response } from "express";
import ViewClassifiesService from "../../../services/Member/MemberClassifyDM/ViewClassifiesService";

class ViewClassifiesController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const classifies = await ViewClassifiesService.execute();
            res.status(200).json({ type: 'success', message: 'Tipos de membros da equipe encontrados com sucesso!', classifies});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewClassifiesController;