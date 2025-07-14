import { FindMemberRequest } from "../../../model/Member/Member/FindMemberRequest";
import prisma from "../../../prisma/prisma";

class SearchMemberService {
  static async execute(findMemberData: FindMemberRequest) {
    const { method, data, limit, sort, isBlocked } = findMemberData;
    let foundMember;

    const baseFilter = isBlocked !== undefined ? { isBlocked } : {};

    if (method === "name") {
      foundMember = await prisma.member.findMany({
        where: {
          ...baseFilter,
          first_name: {
            contains: data,
          },
        },
        take: limit,
        orderBy: {
          createdAt: sort,
        },
      });
    } else if (method === "barcode") {
      foundMember = await prisma.member.findFirst({
        where: {
          ...baseFilter,
          barcode_nmbr: data,
        },
      });
    } else if (method === "email") {
      foundMember = await prisma.member.findMany({
        where: {
          ...baseFilter,
          email: {
            contains: data,
          },
        },
        take: limit,
        orderBy: {
          createdAt: sort,
        },
      });
    } else {
      throw new Error("Método de busca inválido!");
    }

    if (!foundMember) {
      throw new Error("Membro não encontrado!");
    }

    return foundMember;
  }
}

export default SearchMemberService;
