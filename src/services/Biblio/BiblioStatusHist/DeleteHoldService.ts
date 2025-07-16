import prisma from "../../../prisma/prisma";

class DeleteHoldService {
  static async execute(barcode_nmbr: string, mbrid: number) {
    const deletedHold = await prisma.$transaction(async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: { barcode_nmbr },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");

      const memberExists = await prisma.member.findFirst({
        where: { mbrid },
      });

      if (!memberExists) throw new Error("Membro não encontrado!");

      console.log(copyExists);
      console.log(mbrid);

      // Encontra o hold do membro a ser removido
      const myHold = await prisma.biblioHold.findFirst({
        where: {
          copyid: copyExists.id,
          mbrid: mbrid,
        },
      });

      const myHoldHistExists = await prisma.biblioStatusHist.findFirst({
        where: {
          copyid: copyExists.id,
          status_cd: "hld",
          mbrid: mbrid,
        },
      });

      const holdHistExists = await prisma.biblioStatusHist.findFirst({
        where: {
          copyid: copyExists.id,
          status_cd: "hld",
        },
      });

      const holdsExists = await prisma.biblioHold.findMany({
        where: {
          copyid: copyExists.id,
        },
      });

      if (!myHold) console.log("Reserva não encontrada!");
      if (!holdHistExists) throw new Error("Nenhuma reserva feita!");
      if (!myHoldHistExists) console.log("Usuário não é o primeiro da lista!");

      console.log(holdHistExists);

      if (myHold) {
        // O usuário não é primeiro da fila, pois o primeiro está na tabela de hist e copy;
        console.log("ENTROOOOOOOOU AQUI, E O USER NAO É O PRIMEIRO!!!");
        await prisma.biblioHold.delete({
          where: { id: myHold.id },
        });

        // Verifica se há outras pessoas na fila
        const remainingHolds = await prisma.biblioHold.findMany({
          where: { copyid: copyExists.id },
          orderBy: { holdid: "asc" },
        });

        for (let i = 0; i < remainingHolds.length; i++) {
          await prisma.biblioHold.update({
            where: { id: remainingHolds[i].id },
            data: { holdid: i + 1 },
          });
        }
      }
      if (myHoldHistExists) {
        // O usuário é o primeiro e não está na tabela de hold pois já foi removido;
        if (holdsExists && holdsExists.length > 0) {
          console.log("O USER É O PRINCIPAL E EXISTEM MAIS ESPERANDOOOOOO!!!");
          console.log(holdsExists)
          
          const orderedHold = holdsExists.reduce((previousHold, currentHold) =>
            currentHold.holdid < previousHold.holdid
              ? currentHold
              : previousHold
          );

          await prisma.biblioCopy.update({
            where: { id: orderedHold.copyid },
            data: {
              mbrid: orderedHold.mbrid,
              status_cd: "hld",
              status_begin_dt: new Date(),
              due_back_dt: null,
              renewal_count: 0,
            },
          });

          await prisma.biblioStatusHist.update({
            where: { id: myHoldHistExists.id },
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

          const remainingHolds = await prisma.biblioHold.findMany({
            where: { copyid: orderedHold.copyid },
            orderBy: { holdid: "asc" },
          });

          for (let i = 0; i < remainingHolds.length; i++) {
            await prisma.biblioHold.update({
              where: { id: remainingHolds[i].id },
              data: { holdid: i + 1 },
            });
          }
        } else {
          console.log("O USER É O PRINCIPAL E NÃO TEM NINGUÉM ESPERANDOOOO!!!");

          await prisma.biblioCopy.update({
            where: { id: copyExists.id },
            data: {
              mbrid: null,
              status_cd: "in",
              status_begin_dt: new Date(),
              due_back_dt: null,
            },
          });

          await prisma.biblioStatusHist.update({
            where: { id: myHoldHistExists.id },
            data: {
              status_cd: "in",
              mbrid: undefined,
              status_begin_dt: new Date(),
              returned_at: new Date(),
            },
          });
        }
      }
    });

    return deletedHold;
  }
}

export default DeleteHoldService;
