import express from 'express'
import RegisterStaffController from '../controllers/Staff/RegisterStaffController';
import LoginStaffController from '../controllers/Staff/LoginStaffController';
import ViewStaffsController from '../controllers/Staff/ViewStaffsController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

class StaffRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', RegisterStaffController.handle);
        this.router.post('/login', LoginStaffController.handle);
    }

    getRoutes(){
        this.router.get('/viewall', isAuthenticated, ViewStaffsController.handle);
    }

    patchRoutes(){

    }

    deleteRoutes(){

    }
};

export default StaffRoutes