import { Request, Response } from "express";
import BasicDetailMemberService from "../../../services/Member/Member/BasicDetailMemberService";

class BasicDetailMemberController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const mbrid = Number(req.params.mbrid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});

        try{
            const member = await BasicDetailMemberService.execute(mbrid);
            res.status(200).json({ type: 'success', message: 'Membro encontrado com sucesso!', member});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default BasicDetailMemberController;