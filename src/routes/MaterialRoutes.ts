import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { upload } from '../helpers/imageUpload';
import RegisterMaterialController from '../controllers/Material/RegisterMaterialController';

class MaterialRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, upload.single('image_upload'), RegisterMaterialController.handle);
    }

    getRoutes(){
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default MaterialRoutes;