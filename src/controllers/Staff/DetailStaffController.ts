import { Request, Response } from "express";
import DetailStaffService from "../../services/Staff/DetailStaffService";

class DetailStaffController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const userToFind = Number(req.params.userid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const staff = await DetailStaffService.execute(userToFind);
            res.status(200).json({ type: 'success', message: 'Membro da equipe encontrado com sucesso!', staff});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailStaffController;