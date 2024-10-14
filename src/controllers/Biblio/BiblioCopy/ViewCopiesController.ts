import { Request, Response } from "express";
import ViewCopiesService from "../../../services/Biblio/BiblioCopy/ViewCopiesService";

class ViewCopiesController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const copies = await ViewCopiesService.execute();
            res.status(200).json({ type: 'success', message: 'Cópias bibliográficas encontradas com sucesso!', copies});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewCopiesController;