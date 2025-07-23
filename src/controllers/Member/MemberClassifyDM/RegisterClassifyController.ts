import { Request, Response } from "express";
import { RegisterClassifyRequest } from "../../../model/Member/MemberClassifyDM/RegisterClassifyRequest";
import RegisterClassifyService from "../../../services/Member/MemberClassifyDM/RegisterClassifyService";

class RegisterClassifyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const classifyData: RegisterClassifyRequest = req.body;

        if(!classifyData.description) return res.status(422).json({ type: 'error', message: 'Informe a descrição.'});

        try{
            const registeredClassify = await RegisterClassifyService.execute(classifyData);
            res.status(201).json({ type: 'success', message: 'Tipo de membro cadastrado com sucesso!', registeredClassify });
        }catch(err){
            res.status(422).json({ type: 'error', message: 'Erro ao cadastrar o tipo de membro!'});
        };
    };
};

export default RegisterClassifyController;