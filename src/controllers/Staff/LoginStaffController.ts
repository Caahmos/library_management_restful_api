import { Request, Response } from "express";
import { LoginStaffRequest } from "../../model/Staff/LoginStaffRequest";
import LoginStaffService from "../../services/Staff/LoginStaffService";

class LoginStaffController{
    static async handle(req: Request, res: Response){
        const loginStaffData: LoginStaffRequest = req.body;

        if(!loginStaffData.username) return res.status(422).json({ type: 'error', message: 'Informe o nome de usuário!' });
        if(!loginStaffData.password) return res.status(422).json({ type: 'error', message: 'Informe a senha!' });

        try{
            const staffLogged = await LoginStaffService.execute(loginStaffData);
            res.status(201).json({ type: 'success', message: 'Usuário entrou com sucesso!', staffLogged });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        }
    };
};

export default LoginStaffController;