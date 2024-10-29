import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterRankController from '../controllers/Biblio/BiblioRank/RegisterRankController';
import DeleteRankController from '../controllers/Biblio/BiblioRank/DeleteRankController';
import ViewRanksController from '../controllers/Biblio/BiblioRank/ViewRanksController';

class BiblioRankRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register/:bibid', isAuthenticated, RegisterRankController.handle);
    }

    getRoutes(){
        this.router.get('/viewranks/:bibid', isAuthenticated, ViewRanksController.handle);
    }

    patchRoutes(){
    }

    deleteRoutes(){
        this.router.delete('/delete/:id', isAuthenticated, DeleteRankController.handle);
    }
};

export default BiblioRankRoutes;