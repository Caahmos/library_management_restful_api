import { Request, Response } from "express";
import DetailBiblioService from "../../../services/Biblio/Biblio/DetailBiblioService";

class DetailBiblioController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
        const bibid = Number(req.params.bibid);
        
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        // if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        // if(!userroles.catalog_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        try{
            const {biblio, subfieldsDescriptions, collection} = await DetailBiblioService.execute(bibid);
            res.status(200).json({ type: 'success', message: 'Bibliografia encontrada com sucesso!', biblio, subfieldsDescriptions, collection});
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default DetailBiblioController;

// PRECISO LIMPAR TODOS OS ESPAÇOS VAZIOS DAS TABELAS E ARRUMAR O SWAGGER PARA MOSTRAR QUE AGORA RETORNA A DESCRIÇÃO DA COLEÇÃO