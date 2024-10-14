import { Request, Response } from "express";
import DetailCopyService from "../../../services/Biblio/BiblioCopy/DetailCopyService";

class DetailCopyController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const id = Number(req.params.id);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const copy = await DetailCopyService.execute(id);
            res.status(200).json({ type: 'success', message: 'Cópia bibliográfica encontrada com sucesso!', copy});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailCopyController;