import prisma from "../../../prisma/prisma";
import { EditClassifyRequest } from "../../../model/Member/MemberClassifyDM/EditClassifyRequest";

class EditClassifyService {
  static async execute(editClassifyData: EditClassifyRequest) {
    const staffExists = await prisma.memberClassifyDM.findFirst({
      where: {
        code: editClassifyData.code,
      },
    });

    if (!staffExists?.code)
      throw new Error("Nenhuma classificação com esse id encontrado!");

    if (editClassifyData.description) {
      const usernameExists = await prisma.memberClassifyDM.findFirst({
        where: {
          description: editClassifyData.description,
        },
      });

      if (usernameExists) throw new Error("Essa descrição já está em uso!");
    }

    const editedStaff = await prisma.memberClassifyDM.update({
      where: {
        code: editClassifyData.code,
      },
      data: editClassifyData,
    });

    return editedStaff;
  }
}

export default EditClassifyService;
