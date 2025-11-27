import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import SendMessageController from '../controllers/Whatsapp/SendMessageController';
import LogoutWhatsappController from '../controllers/Whatsapp/LogoutController';
import RefreshQrController from '../controllers/Whatsapp/RefreshQrController';

class WhatsappRoutes{
    public router = express.Router();

    constructor(){
        this.postRoutes();
        this.getRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    postRoutes(){
        this.router.post('/sendmessage/:phonenumber', isAuthenticated, SendMessageController.handle);
        this.router.post('/logout', isAuthenticated, LogoutWhatsappController.handle);
    }
    
    getRoutes(){
        this.router.get('/refreshqr', isAuthenticated, RefreshQrController.handle);
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default WhatsappRoutes;