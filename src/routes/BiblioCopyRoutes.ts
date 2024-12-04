import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterCopyController from '../controllers/Biblio/BiblioCopy/RegisterCopyController';
import EditCopyController from '../controllers/Biblio/BiblioCopy/EditCopyController';
import ViewCopiesController from '../controllers/Biblio/BiblioCopy/ViewCopiesController';
import DetailCopyController from '../controllers/Biblio/BiblioCopy/DetailCopyController';
import DeleteCopyController from '../controllers/Biblio/BiblioCopy/DeleteCopyController';

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
        this.router.get('/viewcopies/:bibid', isAuthenticated, ViewCopiesController.handle);
        this.router.get('/detail/:id', isAuthenticated, DetailCopyController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:id', isAuthenticated, EditCopyController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:id', isAuthenticated, DeleteCopyController.handle);
    }
};

export default BiblioCopyRoutes;