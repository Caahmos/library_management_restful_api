import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import TopBooksController from '../controllers/Biblio/BiblioReports/TopBooksController';
import RentalStatisticsController from '../controllers/Biblio/BiblioReports/RentalStatisticsController';

class BiblioReportsRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.get('/topbooks', isAuthenticated, TopBooksController.handle);
        this.router.get('/rentals', isAuthenticated, RentalStatisticsController.handle);
    }

    getRoutes(){
        
    }

    patchRoutes(){
    }

    deleteRoutes(){
        
    }
};

export default BiblioReportsRoutes;