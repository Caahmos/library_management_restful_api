import prisma from "../../../prisma/prisma";

class DeleteRankService{
  static async execute(id: number) {
    const rankExists = await prisma.biblioRank.findFirst({
      where: {
        id: id
      }
    });

    if (!rankExists?.id) throw new Error("Nenhum rank da bibliográfica com esse id encontrado!");

    const deletedRank = await prisma.biblioRank.delete({
      where: {
        id: id
      }
    });

    return deletedRank;
  }
}

export default DeleteRankService;
