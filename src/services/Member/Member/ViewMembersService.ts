import { ViewMembersSearch } from "../../../model/Member/Member/ViewMembersRequest";
import prisma from "../../../prisma/prisma";

class ViewMembersService {
  static async execute(filters: ViewMembersSearch) {
    const { limit = 20, sort = "asc" } = filters;

    const members = await prisma.member.findMany({
      take: limit,
      orderBy: {
        createdAt: sort, 
      },
    });

    if (members.length === 0) {
      throw new Error("Nenhum membro encontrado!");
    }

    return members;
  }
}

export default ViewMembersService;
