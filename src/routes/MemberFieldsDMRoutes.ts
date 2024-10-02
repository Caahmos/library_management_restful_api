import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterFieldController from '../controllers/Member/MemberFieldsDM/RegisterFieldController';
import ViewFieldsController from '../controllers/Member/MemberFieldsDM/ViewFieldsController';
import DetailFieldController from '../controllers/Member/MemberFieldsDM/DetailFieldController';
import EditFieldController from '../controllers/Member/MemberFieldsDM/EditFieldController';
import DeleteFieldController from '../controllers/Member/MemberFieldsDM/DeleteFieldController';

class MemberFieldsDMRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, RegisterFieldController.handle);
    }

    getRoutes(){
        this.router.get('/viewfields', isAuthenticated, ViewFieldsController.handle);
        this.router.get('/detail/:code', isAuthenticated, DetailFieldController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:code', isAuthenticated, EditFieldController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:code', isAuthenticated, DeleteFieldController.handle);
    }
};

export default MemberFieldsDMRoutes;