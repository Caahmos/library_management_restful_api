import { EditFieldRequest } from "../../../model/Member/MemberFieldsDM/EditFieldRequest";
import prisma from "../../../prisma/prisma";

class EditFieldService {
  static async execute(editFieldData: EditFieldRequest, code: string) {
    const fieldExists = await prisma.memberFieldDM.findFirst({
      where: {
        code: code,
      },
    });

    if (!fieldExists?.code)
      throw new Error("Nenhum campo com esse código encontrado!");

    if (editFieldData.code) {
      const usernameExists = await prisma.memberFieldDM.findFirst({
        where: {
          code: editFieldData.code,
        },
      });

      if (usernameExists) throw new Error("Esse código já está registrado!");
    };

    const editedField = await prisma.memberFieldDM.update({
      where: {
        code: code,
      },
      data: editFieldData,
    });

    return editedField;
  }
}

export default EditFieldService;
