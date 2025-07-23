import { Request, Response } from "express";
import HoldService from "../../../services/Biblio/BiblioStatusHist/HoldService";

class HoldController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.circ_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const mbrid = Number(req.params.mbrid);
        const barcode_nmbr: string = req.body.barcode_nmbr;

        if(!mbrid) return res.status(422).json({ type: 'error', message: 'Informe o mbrid!'});
        
        if(!barcode_nmbr) return res.status(422).json({ type: 'error', message: 'Informe o código do livro!'});

        try{
            const held = await HoldService.execute(barcode_nmbr, mbrid);
            res.status(200).json({ type: 'success', message: 'Livro em espera com sucesso!', held});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default HoldController;