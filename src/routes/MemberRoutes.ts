import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterMemberController from '../controllers/Member/Member/RegisterMemberController';
import ViewMembersController from '../controllers/Member/Member/ViewMembersController';
import DetailMemberController from '../controllers/Member/Member/DetailMemberController';
import EditMemberController from '../controllers/Member/Member/EditMemberController';
import DeleteMemberController from '../controllers/Member/Member/DeleteMemberController';
import FindMemberController from '../controllers/Member/Member/FindMemberController';

class MemberRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, RegisterMemberController.handle);
    }

    getRoutes(){
        this.router.get('/find', isAuthenticated, FindMemberController.handle);
        this.router.get('/viewmembers', isAuthenticated, ViewMembersController.handle);
        this.router.get('/detail/:mbrid', isAuthenticated, DetailMemberController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:mbrid', isAuthenticated, EditMemberController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:mbrid', isAuthenticated, DeleteMemberController.handle);
    }
};

export default MemberRoutes;