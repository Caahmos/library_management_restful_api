import prisma from "../../../prisma/prisma";

class DeleteFieldService{
  static async execute(code: string) {
    const fieldExists = await prisma.memberFieldDM.findFirst({
      where: {
        code: code,
      },
    });

    if (!fieldExists?.code) throw new Error("Nenhum campo com esse id encontrado!");

    const deletedField = await prisma.memberFieldDM.delete({
      where: {
        code: code,
      }
    });

    return deletedField;
  }
}

export default DeleteFieldService;
