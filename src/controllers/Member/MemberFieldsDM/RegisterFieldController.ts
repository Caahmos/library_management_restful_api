import { Request, Response } from "express";
import { RegisterFieldRequest } from "../../../model/Member/MemberFieldsDM/RegisterFieldRequest";
import RegisterFieldService from "../../../services/Member/MemberFieldsDM/RegisterFieldService";

class RegisterFieldController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const fieldData: RegisterFieldRequest = req.body;

        if(!fieldData.code) return res.status(422).json({ type: 'error', message: 'Informe o código.'});
        if(!fieldData.description) return res.status(422).json({ type: 'error', message: 'Informe a descrição.'});

        try{
            const registeredField = await RegisterFieldService.execute(fieldData);
            res.status(201).json({ type: 'success', message: 'Campo de membro cadastrado com sucesso!', registeredField });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default RegisterFieldController;