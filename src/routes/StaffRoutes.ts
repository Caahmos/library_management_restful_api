import express from 'express'
import RegisterStaffController from '../controllers/Staff/RegisterStaffController';
import LoginStaffController from '../controllers/Staff/LoginStaffController';
import ViewStaffsController from '../controllers/Staff/ViewStaffsController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import EditStaffController from '../controllers/Staff/EditStaffController';
import ChangeStaffPasswordController from '../controllers/Staff/ChangeStaffPasswordController';
import DeleteStaffController from '../controllers/Staff/DeleteStaffController';
import DetailStaffController from '../controllers/Staff/DetailStaffController';

class StaffRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, RegisterStaffController.handle);
        this.router.post('/login', LoginStaffController.handle);
    }

    getRoutes(){
        this.router.get('/viewstaffs', isAuthenticated, ViewStaffsController.handle);
        this.router.get('/detail/:userid', isAuthenticated, DetailStaffController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:userid', isAuthenticated, EditStaffController.handle);
        this.router.patch('/changepassword/:userid', isAuthenticated, ChangeStaffPasswordController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:userid', isAuthenticated, DeleteStaffController.handle);
    }
};

export default StaffRoutes;