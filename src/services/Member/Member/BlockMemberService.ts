import prisma from "../../../prisma/prisma";
import { isAfter } from "date-fns";

class BlockMemberService {
  static async execute(mbrid: number) {
    const memberExists = await prisma.member.findFirst({
      where: { mbrid },
      include: { member_fields: true },
    });

    if (!memberExists) throw new Error("Membro não encontrado!");

    const verifyCheckOut = await prisma.biblioCopy.findFirst({
      where: {
        mbrid: memberExists.mbrid,
        status_cd: "out",
      },
    });

    if (verifyCheckOut) throw new Error("Realize a devolução do livro primeiro!");

    if (memberExists.isBlocked && memberExists.blocked_until) {
      const now = new Date();

      if (isAfter(now, memberExists.blocked_until)) {
        const changeMemberBlock = await prisma.member.update({
          where: { mbrid: memberExists.mbrid },
          data: {
            isBlocked: false,
            blocked_until: null,
          },
        });

        return changeMemberBlock;
      } else {
        throw new Error(
          `Usuário ainda está bloqueado até ${memberExists.blocked_until.toLocaleDateString()}`
        );
      }
    }

    const changeMemberBlock = await prisma.member.update({
      where: { mbrid: memberExists.mbrid },
      data: { isBlocked: !memberExists.isBlocked },
    });

    return changeMemberBlock;
  }
}

export default BlockMemberService;