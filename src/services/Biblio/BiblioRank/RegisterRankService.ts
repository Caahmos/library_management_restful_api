import { RegisterRankRequest } from "../../../model/Biblio/BiblioMedia/RegisterRankRequest";
import prisma from "../../../prisma/prisma";

class RegisterRankService {
  static async execute(rankData: RegisterRankRequest) {
    let rankNumber = 0;

    const registeredRank = await prisma.$transaction(async (prisma) => {
      const biblioExists = await prisma.biblio.findFirst({
        where: {
          bibid: rankData.bibid,
        },
      });

      if (!biblioExists) throw new Error("Bibliografia não encontrada!");

      const memberExists = await prisma.member.findFirst({
        where: {
          mbrid: rankData.mbrid,
        },
      });

      if (!memberExists) throw new Error("Membro não foi encontrado!");

      const mediaExists = await prisma.biblioMedia.findMany({
        where: {
          bibid: rankData.bibid,
        },
      });

      if (mediaExists.length <= 0) {
        throw new Error("A mídia ainda não foi cadastrada");
      }

      if (mediaExists.length > 0) {
        const lastCountRank = mediaExists.reduce((prevMedia, currentMedia) => {
          return prevMedia.count_ranks > currentMedia.count_ranks
            ? prevMedia
            : currentMedia;
        });

        rankNumber = lastCountRank.count_ranks + 1;
      }

      const rankExists = await prisma.biblioRank.findFirst({
        where: {
          mbrid: rankData.mbrid,
        },
      });

      if (rankExists) throw new Error("Já existe um comentário deste membro!");

      const createdRank = await prisma.biblioRank.create({
        data: {
          ...rankData
        },
      });

      const allRanks = await prisma.biblioRank.findMany({
        where: {
          bibid: rankData.bibid,
        },
      });

      const totalRank = allRanks.reduce((sum, rank) => sum + (rank.rank || 0), 0);
      const averageRank = allRanks.length > 0 ? totalRank / allRanks.length : 0;

      await prisma.biblioMedia.update({
        where: {
          id: mediaExists[0].id,
        },
        data: {
          count_ranks: rankNumber,
          rank: averageRank,
        },
      });

      return createdRank;
    });

    return registeredRank;
  }
}

export default RegisterRankService;
