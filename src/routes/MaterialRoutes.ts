import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { upload } from '../helpers/imageUpload';
import RegisterMaterialController from '../controllers/Material/RegisterMaterialController';
import ViewMaterialController from '../controllers/Material/ViewMaterialsController';
import DetailMaterialController from '../controllers/Material/DetailMaterialController';
import EditMaterialController from '../controllers/Material/EditMaterialController';
import DeleteMaterialController from '../controllers/Material/DeleteMaterialController';

class MaterialRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, upload.single('image_file'), RegisterMaterialController.handle);
    }

    getRoutes(){
        this.router.get('/detail/:code', isAuthenticated, isAuthenticated, DetailMaterialController.handle);
        this.router.get('/viewmaterials', isAuthenticated, isAuthenticated, ViewMaterialController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:code', isAuthenticated, upload.single('image_file'), EditMaterialController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:code', isAuthenticated, DeleteMaterialController.handle);
    }
};

export default MaterialRoutes;