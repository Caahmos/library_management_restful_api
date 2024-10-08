import { Request, Response } from "express";
import ViewStaffsService from "../../services/Staff/ViewStaffsService";

class ViewStaffsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const staffs = await ViewStaffsService.execute();
            res.status(200).json({ type: 'success', message: 'Membros da equipe encontrados com sucesso!', staffs});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewStaffsController;