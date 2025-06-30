import { Request, Response } from "express";
import ViewBibliosService from "../../../services/Biblio/Biblio/ViewBibliosService";

class ViewBibliosController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        // if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        // if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const biblios = await ViewBibliosService.execute();
            res.status(200).json({ type: 'success', message: 'Bibliografias encontradas com sucesso!', biblios});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewBibliosController;