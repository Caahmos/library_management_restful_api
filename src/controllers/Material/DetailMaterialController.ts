import { Request, Response } from "express";
import DetailMaterialService from "../../services/Material/DetailMaterialService";

class DetailMaterialController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const code = Number(req.params.code);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const material = await DetailMaterialService.execute(code);
            res.status(200).json({ type: 'success', message: 'Material encontrado com sucesso!', material});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailMaterialController;