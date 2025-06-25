import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated';
import ViewSubfieldsRequired from '../controllers/Marc/ViewSubfieldsController';

class MarcRoutes{
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
        this.router.get('/viewsubfieldsrequired', isAuthenticated, ViewSubfieldsRequired.handle);
    }

    patchRoutes(){
    }

    deleteRoutes(){

    }
};

export default MarcRoutes;