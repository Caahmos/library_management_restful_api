import prisma from "../../../prisma/prisma";

class CheckinService {
  static async execute(barcode_nmbr: string) {
    const checkedIn = await prisma.$transaction(async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: barcode_nmbr,
        },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      if (copyExists.status_cd === "in")
        throw new Error("Livro já está disponível!");

      if (copyExists.status_cd === "hld")
        throw new Error("O livro está reservado!");

      const biblio = await prisma.biblio.findFirst({
        where: {
          bibid: copyExists.bibid,
        },
      });

      if (!biblio) throw new Error("Livro não existe!");

      const holdExists = await prisma.biblioHold.findMany({
        where: {
          copyid: copyExists.id,
        },
      });

      if (holdExists.length > 0) {
        const orderedHold = holdExists.reduce((previousHold, currentHold) => {
          return currentHold.holdid < previousHold.holdid
            ? currentHold
            : previousHold;
        });

        const checkedIn = await prisma.biblioCopy.update({
          where: {
            id: orderedHold.copyid,
          },
          data: {
            mbrid: orderedHold.mbrid,
            status_cd: "hld",
            status_begin_dt: new Date(),
            due_back_dt: null,
            renewal_count: 0,
          },
        });

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
          where: {
            id: orderedHold.id,
          },
        });

        const remainingHolds = await prisma.biblioHold.findMany({
          where: {
            copyid: copyExists.id,
          },
          orderBy: {
            holdid: "asc",
          },
        });

        for (let i = 0; i < remainingHolds.length; i++) {
          await prisma.biblioHold.update({
            where: {
              id: remainingHolds[i].id,
            },
            data: {
              holdid: i + 1,
            },
          });
        }

        return {
          message:
            "O livro foi colocado em espera, pois um membro fez a reserva!",
          checkedIn: checkedIn,
        };
      }

      const checkedIn = await prisma.biblioCopy.update({
        where: {
          id: copyExists.id,
        },
        data: {
          status_cd: "in",
          mbrid: null,
          due_back_dt: null,
          renewal_count: 0,
        },
      });

      return { message: "Livro devolvido com sucesso!", checkedIn: checkedIn };
    });

    return checkedIn;
  }
}

export default CheckinService;
