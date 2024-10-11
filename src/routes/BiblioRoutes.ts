import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterBiblioController from '../controllers/Biblio/Biblio/RegisterBiblioController';
import ViewBibliosController from '../controllers/Biblio/Biblio/ViewBibliosController';
import DetailBiblioController from '../controllers/Biblio/Biblio/DetailBiblioController';
import EditBiblioController from '../controllers/Biblio/Biblio/EditBiblioController';
import DeleteBiblioController from '../controllers/Biblio/Biblio/DeleteBiblioController';

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
        this.router.get('/viewbiblios', isAuthenticated, ViewBibliosController.handle);
        this.router.get('/detail/:bibid', isAuthenticated, DetailBiblioController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:bibid', isAuthenticated, EditBiblioController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:bibid', isAuthenticated, DeleteBiblioController.handle);
    }
};

export default BiblioRoutes;