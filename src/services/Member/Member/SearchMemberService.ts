import { FindMemberRequest } from "../../../model/Member/Member/FindMemberRequest";
import prisma from "../../../prisma/prisma";

class SearchMemberService {
  static async execute(findMemberData: FindMemberRequest) {
    const { method, data } = findMemberData;
    let foundMember;

    if (method === "name") {
      foundMember = await prisma.member.findMany({
        where: {
          first_name: {
            contains: data,            
          },
        },
      });
    } else if (method === "barcode") {
      foundMember = await prisma.member.findFirst({
        where: {
          barcode_nmbr: data
        },
      });
    } else if (method === "email") {
      foundMember = await prisma.member.findFirst({
        where: {
          email: data
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
