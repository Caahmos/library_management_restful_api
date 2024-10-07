import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterCollectionController from '../controllers/Collection/RegisterCollectionController';
import ViewCollectionsController from '../controllers/Collection/ViewCollectionsController';
import DetailCollectionController from '../controllers/Collection/DetailCollectionController';
import EditCollectionController from '../controllers/Collection/EditCollectionController';
import DeleteCollectionController from '../controllers/Collection/DeleteCollectionController';

class CollectionRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register', isAuthenticated, RegisterCollectionController.handle);
    }

    getRoutes(){
        this.router.get('/viewcollections', isAuthenticated, ViewCollectionsController.handle);
        this.router.get('/detail/:code', isAuthenticated, DetailCollectionController.handle);
    }

    patchRoutes(){
        this.router.patch('/edit/:code', isAuthenticated, EditCollectionController.handle);
    }

    deleteRoutes(){
        this.router.delete('/delete/:code', isAuthenticated, DeleteCollectionController.handle);
    }
};

export default CollectionRoutes;