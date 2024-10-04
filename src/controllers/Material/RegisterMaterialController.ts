import { Request, Response } from "express";
import { RegisterMaterialRequest } from "../../model/Material/RegisterMaterialRequest";
import RegisterMaterialService from "../../services/Material/RegisterMaterialService";

class RegisterMaterialController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const materialData: RegisterMaterialRequest = req.body;

        if(!materialData.description) return res.status(422).json({ type: 'error', message: 'Informe a descrição!'});
        if(req.file){
            materialData.image_file = req.file.filename
        };

        try{
            const registeredMaterial = await RegisterMaterialService.execute(materialData);
            res.status(201).json({ type: 'success', message: 'Material cadastrado com sucesso!', registeredMaterial });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message });
        };
    };
};

export default RegisterMaterialController;