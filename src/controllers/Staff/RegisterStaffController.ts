import { Request, Response } from "express";
import { RegisterStaffRequest } from "../../model/Staff/RegisterStaffRequest";
import RegisterStaffService from "../../services/Staff/RegisterStaffService";

class RegisterStaffController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;
        
    if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
    if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        
    const registerStaffData: RegisterStaffRequest = req.body;

    registerStaffData.last_change_userid = userId;

    if (!registerStaffData.first_name)
      return res
        .status(422)
        .json({ type: "error", message: "Informe o nome!" });
    if (!registerStaffData.last_name)
      return res
        .status(422)
        .json({ type: "error", message: "Informe o sobrenome!" });
    if (!registerStaffData.username)
      return res
        .status(422)
        .json({ type: "error", message: "Informe o nome de usuário!" });
    if (!registerStaffData.password)
      return res
        .status(422)
        .json({ type: "error", message: "Informe a senha!" });
    if (!registerStaffData.password)
      return res
        .status(422)
        .json({ type: "error", message: "Repita a senha!" });

    try {
      const registeredStaff = await RegisterStaffService.execute(
        registerStaffData
      );
      res
        .status(201)
        .json({
          type: "success",
          message: "Membro da equipe registrado com sucesso!",
          registeredStaff,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default RegisterStaffController;
