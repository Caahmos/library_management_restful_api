import prisma from "../../../prisma/prisma";

class DeleteMemberService{
  static async execute(mbrid: number) {
    const memberExists = await prisma.member.findFirst({
      where: {
        mbrid: mbrid,
      },
    });

    if (!memberExists) throw new Error("Nenhum usuário com esse id encontrado!");

    const deletedMember = await prisma.member.delete({
      where: {
        mbrid: mbrid,
      }
    });

    return deletedMember;
  }
}

export default DeleteMemberService;
