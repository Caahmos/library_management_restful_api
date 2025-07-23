import { Request, Response } from "express";
import DeleteHoldService from "../../../services/Biblio/BiblioStatusHist/DeleteHoldService";

class DeleteHoldController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const mbrid = Number(req.params.mbrid);
        const barcode_nmbr = String(req.params.barcode_nmbr);

        if(!mbrid) return res.status(422).json({ type: 'error', message: 'Informe o mbrid!'});
        
        if(!barcode_nmbr) return res.status(422).json({ type: 'error', message: 'Informe o código do livro!'});

        try{
            const checkedOut = await DeleteHoldService.execute(barcode_nmbr, mbrid);
            res.status(200).json({ type: 'success', message: 'Reserva do livro excluída com sucesso!', checkedOut});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DeleteHoldController;