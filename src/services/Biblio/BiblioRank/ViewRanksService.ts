import prisma from "../../../prisma/prisma";

class ViewRanksService {
  static async execute(bibid: number) {
    const ranks = await prisma.biblioRank.findMany({
      where: {
        bibid: bibid
      }
    });

    if (ranks.length <= 0)
      throw new Error("Nenhum rank com esse código encontrado!");

    return ranks;
  }
}

export default ViewRanksService;
