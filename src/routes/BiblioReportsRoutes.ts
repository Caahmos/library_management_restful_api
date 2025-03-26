import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import TopBooksController from '../controllers/Biblio/BiblioReports/TopBooksController';

class BiblioReportsRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.get('/topbooks', isAuthenticated, TopBooksController.handle);
    }

    getRoutes(){
        
    }

    patchRoutes(){
    }

    deleteRoutes(){
        
    }
};

export default BiblioReportsRoutes;