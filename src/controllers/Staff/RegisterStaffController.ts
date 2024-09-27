import { Request, Response } from "express";
import { RegisterStaffRequest } from "../../model/Staff/RegisterStaffRequest";
import RegisterStaffService from "../../services/Staff/RegisterStaffService";

class RegisterStaffController {
  static async handle(req: Request, res: Response) {
    const registerStaffData: RegisterStaffRequest = req.body;

    if (!registerStaffData.firstName)
      return res
        .status(422)
        .json({ type: "error", message: "Informe o nome!" });
    if (!registerStaffData.lastName)
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
          message: "Administrador registrado com sucesso!",
          registeredStaff,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default RegisterStaffController;
