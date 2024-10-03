import { Request, Response } from "express";
import { RegisterMemberRequest } from "../../../model/Member/Member/RegisterMemberRequest";
import RegisterMemberService from "../../../services/Member/Member/RegisterMemberService";

class RegisterMemberController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const memberData: RegisterMemberRequest = req.body;

        memberData.last_change_userid = userId;

        if(!memberData.classification) return res.status(422).json({ type: 'error', message: 'Informe a classificação!'});
        if(!memberData.barcode_nmbr) return res.status(422).json({ type: 'error', message: 'Informe o número do cartão!'});
        if(!memberData.first_name) return res.status(422).json({ type: 'error', message: 'Informe seu primeiro nome!'});
        if(!memberData.last_name) return res.status(422).json({ type: 'error', message: 'Informe seu segundo nome!'});
        if(!memberData.email) return res.status(422).json({ type: 'error', message: 'Informe o seu email!'});

        try{
            const registeredMember = await RegisterMemberService.execute(memberData);
            res.status(201).json({ type: 'success', message: 'Membro registrado com sucesso!', registeredMember });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default RegisterMemberController;