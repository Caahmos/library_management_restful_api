import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import EditCheckPrivsController from '../controllers/CheckoutPrivs/EditCheckPrivController';
import ViewCheckPrivsController from '../controllers/CheckoutPrivs/ViewCheckPrivsController';
import DetailCheckPrivsController from '../controllers/CheckoutPrivs/DetailCheckPrivController';

class CheckoutPrivsRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
    }
    
    getRoutes(){
        this.router.get('/detail/:id', isAuthenticated, DetailCheckPrivsController.handle);
        this.router.get('/viewcheckprivs', isAuthenticated, ViewCheckPrivsController.handle);
    }
    
    patchRoutes(){
        this.router.patch('/edit/:id', isAuthenticated, EditCheckPrivsController.handle);
    }

    deleteRoutes(){
    }
};

export default CheckoutPrivsRoutes;