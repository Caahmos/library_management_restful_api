import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterMemberController from '../controllers/Member/Member/RegisterMemberController';
import ViewMembersController from '../controllers/Member/Member/ViewMembersController';
import DetailMemberController from '../controllers/Member/Member/DetailMemberController';
import EditMemberController from '../controllers/Member/Member/EditMemberController';
import DeleteMemberController from '../controllers/Member/Member/DeleteMemberController';
import SearchMemberController from '../controllers/Member/Member/SearchMemberController';
import UpdateMemberImageController from '../controllers/Member/Member/UpdateMemberImageController';
import { upload } from '../helpers/imageUpload';

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
        this.router.get('/search', isAuthenticated, SearchMemberController.handle);
        this.router.get('/viewmembers', isAuthenticated, ViewMembersController.handle);
        this.router.get('/detail/:mbrid', isAuthenticated, DetailMemberController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:mbrid', isAuthenticated, EditMemberController.handle);
        this.router.patch('/updateimage/:mbrid', isAuthenticated, upload.single('image_file'), UpdateMemberImageController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:mbrid', isAuthenticated, DeleteMemberController.handle);
    }
};

export default MemberRoutes;