import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import RegisterCopyController from '../controllers/Biblio/BiblioCopy/RegisterCopyController';
import SendMessageController from '../controllers/Whatsapp/SendMessageController';

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
    }

    getRoutes(){
    }

    patchRoutes(){
    }

    deleteRoutes(){
    }
};

export default WhatsappRoutes;