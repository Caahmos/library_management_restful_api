import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterTransactionController from '../controllers/Member/MemberAccount/RegisterTransactionController';
import DeleteTransactionController from '../controllers/Member/MemberAccount/DeleteTransactionController';
import ViewTransactionsController from '../controllers/Member/MemberAccount/ViewTransactionsController';

class MemberAccountRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/register/:mbrid', isAuthenticated, RegisterTransactionController.handle);
    }

    getRoutes(){
        this.router.get('/viewtransactions', isAuthenticated, ViewTransactionsController.handle);
    }

    patchRoutes(){
    }

    deleteRoutes(){
        this.router.delete('/delete/:id', isAuthenticated, DeleteTransactionController.handle);
    }
};

export default MemberAccountRoutes;