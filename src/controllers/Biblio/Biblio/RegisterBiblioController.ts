import { Request, Response } from "express";
import { RegisterBiblioRequest } from "../../../model/Biblio/Biblio/RegisterBiblioRequest";
import RegisterBiblioService from "../../../services/Biblio/Biblio/RegisterBiblioService";

class RegisterBiblioController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const biblioData: RegisterBiblioRequest = req.body;

        biblioData.last_change_userid = userId;

        if(!biblioData.material_cd) return res.status(422).json({ type: 'error', message: 'Escolha uma das opções de materiais!'});
        if(!biblioData.collection_cd) return res.status(422).json({ type: 'error', message: 'Escolha uma das opções de coleções!'});
        if(!biblioData.call_nmbr1) return res.status(422).json({ type: 'error', message: 'Informe o número de contato!'});
        if(!biblioData.title) return res.status(422).json({ type: 'error', message: 'Informe o título!'});
        if(!biblioData.author) return res.status(422).json({ type: 'error', message: 'Informe o nome do autor!'});

        try{
            const registeredBibliography = await RegisterBiblioService.execute(biblioData);
            res.status(201).json({ type: 'success', message: 'Bibliografia cadastrada com sucesso!', registeredBibliography });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    };
};

export default RegisterBiblioController;