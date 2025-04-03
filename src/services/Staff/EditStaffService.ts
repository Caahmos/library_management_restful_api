import { EditStaffRequest } from "../../model/Staff/EditStaffRequest";
import prisma from "../../prisma/prisma";

class EditStaffService {
  static async execute(editStaffData: EditStaffRequest) {
    const staffExists = await prisma.staff.findFirst({
      where: {
        userid: editStaffData.userid,
      },
    });

    if (!staffExists?.userid)
      throw new Error("Nenhum usuário com esse id encontrado!");

    if (editStaffData.username) {
      const usernameExists = await prisma.staff.findFirst({
        where: {
          username: editStaffData.username,
        },
      });

      if (usernameExists)
        throw new Error("Esse nome de usuário já está em uso!");
    }

    const editedStaff = await prisma.staff.update({
      where: {
        userid: editStaffData.userid,
      },
      data: editStaffData,
      select: {
        userid: true,
        first_name: true,
        last_name: true,
        username: true,
        admin_flg: true,
        circ_flg: true,
        circ_mbr_flg: true,
        catalog_flg: true,
        reports_flg: true,
        suspended_flg: true,
      }
    });

    return editedStaff;
  }
}

export default EditStaffService;
