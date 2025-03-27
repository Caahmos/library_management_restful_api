import { Request, Response } from "express";
import RentalStatisticsService from "../../../services/BiblioReports/RentalStatisticsService";

class RentalStatisticsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const rentals = await RentalStatisticsService.execute();
            res.status(200).json({ type: 'success', message: 'Busca realizada com sucesso!', rentals});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: 'Erro ao realizar a busca!'});
        }

    }
}

export default RentalStatisticsController;