import { Request, Response } from "express";
import { EditCheckPrivRequest } from "../../model/CheckoutPrivs/EditCheckPrivRequest";
import EditCheckPrivService from "../../services/CheckoutPrivs/EditCheckPrivsService";

class EditCheckPrivController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        
        const checkoutPrivData: EditCheckPrivRequest = req.body;
        const id = Number(req.params.id);

        if(Object.keys(checkoutPrivData).length <= 0) return res.status(422).json({ type: 'error', message: 'Nada a ser atualizado!'});

        try{
            const EditedCheckPriv = await EditCheckPrivService.execute(checkoutPrivData, id);
            res.status(201).json({ type: 'success', message: 'Informações de tempo de permanência com os material atualizado!', EditedCheckPriv });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    };
};

export default EditCheckPrivController;