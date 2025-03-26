import { Request, Response } from "express";
import TopBooksService from "../../../services/BiblioReports/TopBooksService";

class TopBooksController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const topBooks = await TopBooksService.execute();
            res.status(200).json({ type: 'success', message: 'Busca realizada com sucesso!', topBooks});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: 'Erro ao realizar a busca!'});
        }

    }
}

export default TopBooksController;