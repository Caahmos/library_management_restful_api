import { Request, Response } from "express";
import ViewCopiesService from "../../../services/Biblio/BiblioCopy/ViewCopiesService";

class ViewCopiesController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const bibid = Number(req.params.bibid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!bibid) return res.status(422).json({ type: 'error', message: 'Nenhuma bibliografia informada!'});

        try{
            const copies = await ViewCopiesService.execute(bibid);
            res.status(200).json({ type: 'success', message: 'Cópias bibliográficas encontradas com sucesso!', copies});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewCopiesController;