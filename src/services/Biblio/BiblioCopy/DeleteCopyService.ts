import prisma from "../../../prisma/prisma";

class DeleteCopyService{
  static async execute(id: number) {
    const copyExists = await prisma.biblioCopy.findFirst({
      where: {
        id: id
      }
    });

    if (!copyExists?.id) throw new Error("Nenhuma cópia bibliográfica com esse id encontrada!");

    const deletedCopy = await prisma.biblioCopy.delete({
      where: {
        id: id
      }
    });

    return deletedCopy;
  }
}

export default DeleteCopyService;
