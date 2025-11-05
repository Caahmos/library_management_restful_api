import prisma from "../../../prisma/prisma";
import { adjustDateToWeekday } from "../../../utils/adjustDateToWeekday";

class CheckoutService {
  static async execute(barcode_nmbr: string, mbrid: number) {
    const checkedOut = await prisma.$transaction(async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: barcode_nmbr,
        },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      if (copyExists.status_cd === "hld" && copyExists.mbrid !== mbrid)
        throw new Error(
          "Outro membro fez a reserva desse livro. Entre na fila!"
        );

      if (copyExists.status_cd !== "in" && copyExists.status_cd !== "hld")
        throw new Error("Livro não disponível!");

      const biblio = await prisma.biblio.findFirst({
        where: {
          bibid: copyExists.bibid,
        },
      });

      if (!biblio) throw new Error("Livro não existe!");

      const memberExistis = await prisma.member.findFirst({
        where: {
          mbrid: mbrid,
        },
      });

      if (!memberExistis) throw new Error("Esse membro não foi encontrado!");

      const memberIsBlocked = await prisma.member.findFirst({
        where: {
          mbrid: mbrid,
          isBlocked: true,
        },
      });

      if (memberIsBlocked) throw new Error("O membro está bloqueado!");

      const checkoutLimit = await prisma.checkoutPrivs.findFirst({
        where: {
          material_cd: biblio.material_cd,
          classification: memberExistis.classification,
        },
      });

      if (!checkoutLimit)
        throw new Error("Nenhum informação de limites encontrada.");

      const qtdBooksOut = await prisma.biblioStatusHist.findMany({
        where: {
          mbrid: memberExistis.mbrid,
          status_cd: "out",
        },
      });

      if (qtdBooksOut && qtdBooksOut.length >= checkoutLimit.checkout_limit)
        throw new Error("Quantidade máxima de empréstimos atingida!");

      const daysDueBack = await prisma.collectionDM.findFirst({
        where: {
          code: biblio.collection_cd,
        },
      });

      if (!daysDueBack)
        throw new Error(
          "Informações de permanência do livro com o usuário não foram encontradas!"
        );

      const currentDate = Date.now();
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const daysToAdd = daysDueBack.days_due_back;

      let due_back_dt = new Date(currentDate + daysToAdd * millisecondsInADay);
      due_back_dt = adjustDateToWeekday(due_back_dt);

      const myHold = await prisma.biblioStatusHist.findFirst({
        where: {
          status_cd: "hld",
          copyid: copyExists.id,
          mbrid: mbrid,
        },
      });

      if (myHold) {
        const checkedOut = await prisma.biblioStatusHist.update({
          where: {
            id: myHold.id,
          },
          data: {
            copyid: copyExists.id,
            due_back_dt: due_back_dt,
            mbrid: mbrid,
            bibid: copyExists.bibid,
            status_cd: "out",
          },
        });

        const biblioCopyUpdate = await prisma.biblioCopy.update({
          where: {
            id: copyExists.id,
          },
          data: {
            status_cd: "out",
            mbrid: mbrid,
            due_back_dt: due_back_dt,
          },
        });

        return checkedOut;
      }

      const checkedOut = await prisma.biblioStatusHist.create({
        data: {
          copyid: copyExists.id,
          due_back_dt: due_back_dt,
          mbrid: mbrid,
          bibid: copyExists.bibid,
          status_cd: "out",
        },
      });

      const biblioCopyUpdate = await prisma.biblioCopy.update({
        where: {
          id: copyExists.id,
        },
        data: {
          status_cd: "out",
          mbrid: mbrid,
          due_back_dt: due_back_dt,
        },
      });

      return checkedOut;
    });

    return checkedOut;
  }
}

export default CheckoutService;
