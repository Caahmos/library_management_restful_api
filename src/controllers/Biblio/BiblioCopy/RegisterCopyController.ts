import { Request, Response } from "express";
import { RegisterCopyRequest } from "../../../model/Biblio/BiblioCopy/RegisterCopyRequest";
import RegisterCopyService from "../../../services/Biblio/BiblioCopy/RegisterCopyService";

class RegisterCopyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const copyData: RegisterCopyRequest = req.body;
        copyData.bibid = Number(req.params.bibid);

        if(!copyData.bibid) return res.status(422).json({ type: 'error', message: 'Informe a bibid da bibliografia!'});
        if(!copyData.barcode_nmbr) return res.status(422).json({ type: 'error', message: 'Informe o código da cópia!'});

        try{
            const registeredCopy = await RegisterCopyService.execute(copyData);
            res.status(201).json({ type: 'success', message: 'Cópia cadastrada com sucesso!', registeredCopy });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    };
};

export default RegisterCopyController;