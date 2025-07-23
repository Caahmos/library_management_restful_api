import { Request, Response } from "express";
import { RegisterAccountRequest } from "../../../model/Member/MemberAccount/RegisterAccountRequest";
import RegisterTransactionService from "../../../services/Member/MemberAccount/RegisterTransactionService";

class RegisterTransactionController {
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const mbrid = Number(req.params.mbrid);
            
        if(!mbrid) return res.status(422).json({ type: 'error', message: 'Usuário não informado!'});
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const transactionData: RegisterAccountRequest = req.body;

        transactionData.create_userid = userId;
        transactionData.mbrid = mbrid;

        if(!transactionData.transaction_type) return res.status(422).json({ type: 'error', message: 'Informe o tipo de transação!!'});
        if(!transactionData.description) return res.status(422).json({ type: 'error', message: 'Informe a descrição!!'});
        if(!transactionData.amount) return res.status(422).json({ type: 'error', message: 'Informe o valor!'});

        try{
            const registeredTransaction = await RegisterTransactionService.execute(transactionData);
            res.status(201).json({ type: 'success', message: 'Transação registrada com sucesso!', registeredTransaction });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default RegisterTransactionController;