import { Crypto } from "../../helpers/crypto";
import { ChangeStaffPasswordRequest } from "../../model/Staff/ChangeStaffPasswordRequest";
import prisma from "../../prisma/prisma";

class ChangeStaffPasswordService {
  static async execute(changePasswordData: ChangeStaffPasswordRequest) {
    const staffExists = await prisma.staff.findFirst({
      where: {
        userid: changePasswordData.userid,
      },
    });

    if (!staffExists?.userid) throw new Error("Nenhum usuário com esse id encontrado!");

    if (changePasswordData.password !== changePasswordData.confirmPassword) throw new Error("As senhas não estão iguais!");

    const hashPassword = await Crypto.encrypt(10, changePasswordData.password);

    changePasswordData.password = hashPassword;

    const editedStaff = await prisma.staff.update({
      where: {
        userid: changePasswordData.userid,
      },
      data: {
        password: changePasswordData.password,
        last_change_userid: changePasswordData.last_change_userid
      },
    });

    return editedStaff;
  }
}

export default ChangeStaffPasswordService;
