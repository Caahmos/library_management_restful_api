import { Request, Response } from "express";
import CheckinService from "../../../services/Biblio/BiblioStatusHist/CheckinService";

class CheckinController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const barcode_nmbr: string = req.body.barcode_nmbr;
        
        if(!barcode_nmbr) return res.status(422).json({ type: 'error', message: 'Informe o código do livro!'});

        try{
            const {message, checkedIn} = await CheckinService.execute(barcode_nmbr);
            res.status(200).json({ type: 'success', message: message, checkedIn});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default CheckinController;