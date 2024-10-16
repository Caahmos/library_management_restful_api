import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import CheckoutController from '../controllers/Biblio/BiblioStatusHist/CheckoutController';
import CheckinController from '../controllers/Biblio/BiblioStatusHist/CheckinController';
import RenewalController from '../controllers/Biblio/BiblioStatusHist/RenewalController';

class BiblioHistRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/renewal/:mbrid', isAuthenticated, RenewalController.handle);
        this.router.post('/checkin', isAuthenticated, CheckinController.handle);
        this.router.post('/checkout/:mbrid', isAuthenticated, CheckoutController.handle);
    }

    getRoutes(){
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default BiblioHistRoutes;