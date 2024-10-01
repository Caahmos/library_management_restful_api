import prisma from "../../../prisma/prisma";
import { EditClassifyRequest } from "../../../model/Member/MemberClassifyDM/EditClassifyRequest";

class EditClassifyService {
  static async execute(editClassifyData: EditClassifyRequest) {
    const classifyExists = await prisma.memberClassifyDM.findFirst({
      where: {
        code: editClassifyData.code,
      },
    });

    if (!classifyExists?.code)
      throw new Error("Nenhuma classificação com esse id encontrado!");

    if (editClassifyData.description) {
      const usernameExists = await prisma.memberClassifyDM.findFirst({
        where: {
          description: editClassifyData.description,
        },
      });

      if (usernameExists) throw new Error("Essa descrição já está em uso!");
    }

    const editedClassify = await prisma.memberClassifyDM.update({
      where: {
        code: editClassifyData.code,
      },
      data: editClassifyData,
    });

    return editedClassify;
  }
}

export default EditClassifyService;
