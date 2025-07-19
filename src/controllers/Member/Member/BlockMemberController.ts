import { Request, Response } from "express";
import DetailMemberService from "../../../services/Member/Member/DetailMemberService";
import BlockMemberService from "../../../services/Member/Member/BlockMemberService";

class BlockMemberController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const mbrid = Number(req.params.mbrid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const member = await BlockMemberService.execute(mbrid);
            res.status(200).json({ type: 'success', message: 'Alteração de bloqueio realizada com sucesso!', member});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default BlockMemberController;