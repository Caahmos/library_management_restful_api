import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterClassifyController from '../controllers/Member/MemberClassifyDM/RegisterClassifyController';
import ViewClassifiesController from '../controllers/Member/MemberClassifyDM/ViewClassifiesController';
import EditClassifyController from '../controllers/Member/MemberClassifyDM/EditClassifyController';
import DetailClassifyController from '../controllers/Member/MemberClassifyDM/DetailClassifyController';
import DeleteClassifyController from '../controllers/Member/MemberClassifyDM/DeleteClassifyController';

class MemberClassifyDMRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, RegisterClassifyController.handle);
    }

    getRoutes(){
        this.router.get('/viewall', isAuthenticated, ViewClassifiesController.handle);
        this.router.get('/detail/:code', isAuthenticated, DetailClassifyController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:code', isAuthenticated, EditClassifyController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:code', isAuthenticated, DeleteClassifyController.handle);
    }
};

export default MemberClassifyDMRoutes;