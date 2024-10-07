import prisma from "../../prisma/prisma";

class DeleteCollectionService{
  static async execute(code: number) {
    const collectionExists = await prisma.collectionDM.findFirst({
      where: {
        code: code
      }
    });

    if (!collectionExists?.code) throw new Error("Nenhuma coleção com esse id encontrada!");

    const deletedCollection = await prisma.collectionDM.delete({
      where: {
        code: code
      }
    });

    return deletedCollection;
  }
}

export default DeleteCollectionService;
