import { Request, Response } from "express";
import ViewHoldsService from "../../../services/Biblio/BiblioStatusHist/ViewHoldsService";

class ViewHoldsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const bibid = Number(req.params.bibid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const foundHolds = await ViewHoldsService.execute(bibid);
            res.status(200).json({ type: 'success', message: 'Histórico de reservas encontrado com sucesso!', foundHolds});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewHoldsController;