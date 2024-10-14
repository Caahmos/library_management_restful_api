import prisma from "../../../prisma/prisma";

class CheckinService {
  static async execute(barcode_nmbr: string) {
    const checkedIn = await prisma.$transaction( async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: barcode_nmbr,
        },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      if (copyExists.status_cd === 'in') throw new Error("Livro já está disponível!");

      const biblio = await prisma.biblio.findFirst({
        where: {
          bibid: copyExists.bibid,
        },
      });

      if (!biblio) throw new Error("Livro não existe!");

      const checkedIn = await prisma.biblioCopy.update({
        where: {
          id: copyExists.id,
        },
        data: {
          status_cd: "in",
          mbrid: null,
          due_back_dt: null,
          renewal_count: 0
        },
      });

      return checkedIn;
    });

    return checkedIn;
  }
}

export default CheckinService;
