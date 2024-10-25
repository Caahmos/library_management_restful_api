import { RegisterRankRequest } from "../../../model/Biblio/BiblioMedia/RegisterRankRequest";
import prisma from "../../../prisma/prisma";

class RegisterRankService {
  static async execute(rankData: RegisterRankRequest) {
    const memberExists = await prisma.member.findFirst({ where: {
      mbrid: rankData.mbrid
    }});

    if (!memberExists)
      throw new Error("Membro não foi encontrado!");

    const rankExists = await prisma.biblioRank.findFirst({
      where: {
        mbrid: rankData.mbrid
      },
    });

    if (rankExists)
      throw new Error("Já existe um comentário deste membro!");

    const registeredRank = await prisma.biblioRank.create({
      data: rankData
    });

    return registeredRank;
  }
}

export default RegisterRankService;
