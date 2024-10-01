import prisma from "../../../prisma/prisma";

class DeleteClassifyService{
  static async execute(code: number) {
    const classifyExists = await prisma.memberClassifyDM.findFirst({
      where: {
        code: code,
      },
    });

    if (!classifyExists?.code) throw new Error("Nenhuma classificação com esse id encontrada!");

    const deletedClassify = await prisma.memberClassifyDM.delete({
      where: {
        code: code,
      }
    });

    return deletedClassify;
  }
}

export default DeleteClassifyService;
