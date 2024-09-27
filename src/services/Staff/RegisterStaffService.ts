import prisma from "../../prisma/prisma";
import { RegisterStaffRequest } from "../../model/Staff/RegisterStaffRequest";
import { Crypto } from "../../helpers/crypto";

class RegisterStaffService {
  static async execute(registerStaffData: RegisterStaffRequest) {

    const staffAlreadyExists = await prisma.staff.findFirst({ 
        where: {
            username: registerStaffData.username 
        }
    });

    if(staffAlreadyExists) throw new Error('Já existe um usuário com esse login!');

    if (registerStaffData.password !== registerStaffData.confirmPassword)
      throw new Error("As senhas não estão iguais!");
    registerStaffData.confirmPassword = undefined;

    const hashPassword = await Crypto.encrypt(10, registerStaffData.password);

    registerStaffData.password = hashPassword;

    const registeredStaff = await prisma.staff.create({
      data: registerStaffData,
    });

    return registeredStaff;
  };
};

export default RegisterStaffService;
