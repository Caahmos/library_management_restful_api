import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterCopyController from '../controllers/Biblio/BiblioCopy/RegisterCopyController';

class BiblioCopyRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register/:bibid', isAuthenticated, RegisterCopyController.handle);
    }

    getRoutes(){
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default BiblioCopyRoutes;