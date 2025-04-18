import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterBiblioController from '../controllers/Biblio/Biblio/RegisterBiblioController';
import ViewBibliosController from '../controllers/Biblio/Biblio/ViewBibliosController';
import DetailBiblioController from '../controllers/Biblio/Biblio/DetailBiblioController';
import EditBiblioController from '../controllers/Biblio/Biblio/EditBiblioController';
import DeleteBiblioController from '../controllers/Biblio/Biblio/DeleteBiblioController';
import SearchBibliosController from '../controllers/Biblio/Biblio/SearchBibliosController';
import UpdateImageController from '../controllers/Biblio/Biblio/UpdateImageController';
import { upload } from '../helpers/imageUpload';
import TopSearchService from '../services/Biblio/Biblio/RandomSearchService';
import RandomSearchController from '../controllers/Biblio/Biblio/RandomSearchController';
import DetailedSearchController from '../controllers/Biblio/Biblio/DetailedSearchController';

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
        this.router.get('/search', isAuthenticated, SearchBibliosController.handle);
        this.router.get('/randomsearch', isAuthenticated, RandomSearchController.handle);
        this.router.get('/viewbiblios', isAuthenticated, ViewBibliosController.handle);
        this.router.get('/detail/:bibid', isAuthenticated, DetailBiblioController.handle);
        this.router.get('/detailedsearch', isAuthenticated, DetailedSearchController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:bibid', isAuthenticated, EditBiblioController.handle);
        this.router.patch('/updateimage/:bibid', isAuthenticated, upload.single('image_file'), UpdateImageController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:bibid', isAuthenticated, DeleteBiblioController.handle);
    }
};

export default BiblioRoutes;