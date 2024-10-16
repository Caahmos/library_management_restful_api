import { Request, Response } from "express";
import ViewHistService from "../../../services/Biblio/BiblioStatusHist/ViewHistService";

class ViewHistController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const copyid = Number(req.params.copyid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const foundHist = await ViewHistService.execute(copyid);
            res.status(200).json({ type: 'success', message: 'Histórico encontrado com sucesso!', foundHist});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewHistController;