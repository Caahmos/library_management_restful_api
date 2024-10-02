import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterMemberController from '../controllers/Member/Member/RegisterMemberController';

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
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default MemberRoutes;