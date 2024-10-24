import { Request, Response } from "express";
import { RegisterRankRequest } from "../../../model/Biblio/BiblioMedia/RegisterRankRequest";
import RegisterRankService from "../../../services/Biblio/BiblioMedia/RegisterMediaService";

class RegisterRankController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const rankData: RegisterRankRequest = req.body;
        rankData.bibid = Number(req.params.bibid);

        if(!rankData.comment) return res.status(422).json({ type: 'error', message: 'Escreva algo sobre o livro!'});
        if(!rankData.rank) return res.status(422).json({ type: 'error', message: 'Qual nota você daria para esse livro?'});
        if(!rankData.mbrid) return res.status(422).json({ type: 'error', message: 'Membro não especificado!'});

        try{
            const registeredRank = await RegisterRankService.execute(rankData);
            res.status(201).json({ type: 'success', message: 'Comentário e nota registrados com sucesso!', registeredRank});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    };
};

export default RegisterRankController;