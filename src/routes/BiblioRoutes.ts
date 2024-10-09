import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterBiblioController from '../controllers/Biblio/Biblio/RegisterBiblioController';

class BiblioRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, RegisterBiblioController.handle);
    }

    getRoutes(){
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default BiblioRoutes;