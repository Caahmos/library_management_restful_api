import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterRankController from '../controllers/Biblio/BiblioMedia/RegisterRankController';

class BiblioMediaRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register/:bibid', isAuthenticated, RegisterRankController.handle);



        //CONTINUAR A LÓGICA PARA ADICIONAR COMENTÁRIO E RANK DOS MEMBROS, FALTA IMPORTAR AS TABELAS NOVAMENTE E DEPOIS
        //COMEÇAR A LÓGICA PARA ADICIONAR AS IMAGENS E FAZER A MÉDIA DOS RANKS PELO BIBID

        
    }

    getRoutes(){
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default BiblioMediaRoutes;