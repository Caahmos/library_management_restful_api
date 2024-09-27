import { Request, Response } from "express";

class ViewStaffsController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            res.status(200).json({ type: 'success', message: 'Membros da equipe encontrados com sucesso!'});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: 'Erro ao exibir os membros equipe!'});
        };
    };
};

export default ViewStaffsController;