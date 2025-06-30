import prisma from "../../prisma/prisma";
import { LoginStaffRequest } from "../../model/Staff/LoginStaffRequest";
import { Crypto } from "../../helpers/crypto";
import { Token } from "../../helpers/token";

class LoginStaffService {
  static async execute(loginStaffData: LoginStaffRequest) {
    const staffExists = await prisma.staff.findFirst({
      where: {
        username: loginStaffData.username,
      },
    });

    if (!staffExists) throw new Error("Usuário e/ou senha incorretos!");
    if(staffExists.suspended_flg) throw new Error("Essa conta está suspensa, entre em contato com o suporte para liberar-la novamente!");

    await Crypto.compare(loginStaffData.password, staffExists.password);

    const token = Token.create({
      userid: staffExists.userid,
      admin_flg: staffExists.admin_flg,
      circ_flg: staffExists.circ_flg,
      circ_mbr_flg: staffExists.circ_mbr_flg,
      catalog_flg: staffExists.catalog_flg,
      reports_flg: staffExists.reports_flg,
    });

    return {
      userid: staffExists.userid,
      admin_flg: staffExists.admin_flg,
      circ_flg: staffExists.circ_flg,
      circ_mbr_flg: staffExists.circ_mbr_flg,
      catalog_flg: staffExists.catalog_flg,
      reports_flg: staffExists.reports_flg,
      first_name: staffExists.first_name,
      last_name: staffExists.last_name,
      token: token
    };
  }
}

export default LoginStaffService;
