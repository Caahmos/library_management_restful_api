import prisma from "../../../prisma/prisma";

class CheckinService {
  static async execute(barcode_nmbr: string) {
    const checkedIn = await prisma.$transaction(async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: { barcode_nmbr },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      if (copyExists.status_cd === "in")
        throw new Error("Livro já está disponível!");
      if (copyExists.status_cd === "hld" && copyExists.mbrid)
        throw new Error("O livro está reservado!");

      const biblio = await prisma.biblio.findFirst({
        where: { bibid: copyExists.bibid },
      });

      if (!biblio) throw new Error("Livro não existe!");

      const holdExists = await prisma.biblioHold.findMany({
        where: { copyid: copyExists.id },
      });

      if (holdExists.length > 0) {
        const orderedHold = holdExists.reduce((previousHold, currentHold) =>
          currentHold.holdid < previousHold.holdid ? currentHold : previousHold
        );

        const checkedIn = await prisma.biblioCopy.update({
          where: { id: orderedHold.copyid },
          data: {
            mbrid: orderedHold.mbrid,
            status_cd: "hld",
            status_begin_dt: new Date(),
            due_back_dt: null,
            renewal_count: 0,
          },
        });

        const lastHist = await prisma.biblioStatusHist.findFirst({
          where: { copyid: copyExists.id },
          orderBy: { status_begin_dt: "desc" },
        });

        if (lastHist) {
          await prisma.biblioStatusHist.update({
            where: { id: lastHist.id },
            data: {
              status_cd: "in",
              returned_at: new Date(),
            },
          });
        }

        await prisma.biblioStatusHist.create({
          data: {
            bibid: copyExists.bibid,
            status_cd: "hld",
            mbrid: orderedHold.mbrid,
            copyid: orderedHold.copyid,
            status_begin_dt: new Date(),
          },
        });

        await prisma.biblioHold.delete({
          where: { id: orderedHold.id },
        });

        return {
          message:
            "O livro foi colocado em espera, pois um membro fez a reserva!",
          checkedIn,
        };
      }

      const checkedIn = await prisma.biblioCopy.update({
        where: { id: copyExists.id },
        data: {
          status_cd: "in",
          mbrid: null,
          due_back_dt: null,
          renewal_count: 0,
        },
      });

      const lastHist = await prisma.biblioStatusHist.findFirst({
        where: { copyid: copyExists.id },
        orderBy: { status_begin_dt: "desc" },
      });

      if (lastHist) {
        await prisma.biblioStatusHist.update({
          where: { id: lastHist.id },
          data: {
            status_cd: "in",
            returned_at: new Date(),
          },
        });
      }

      return { message: "Livro devolvido com sucesso!", checkedIn };
    });

    return checkedIn;
  }
}

export default CheckinService;
