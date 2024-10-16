import prisma from "../../../prisma/prisma";

class CheckoutService {
  static async execute(barcode_nmbr: string, mbrid: number) {
    const checkedOut = await prisma.$transaction( async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: barcode_nmbr,
        },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      if(copyExists.status_cd === 'hld' && copyExists.mbrid !== mbrid) throw new Error('Outro membro fez a reserva desse livro. Entre na fila!')
      
      if (copyExists.status_cd !== 'in' && copyExists.status_cd !== 'hld' ) throw new Error("Livro não disponível!");

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

      const checkoutInfo = await prisma.checkoutPrivs.findFirst({
        where: {
          classification: memberExistis.classification,
          material_cd: biblio.material_cd,
        },
      });

      if (!checkoutInfo)
        throw new Error(
          "Informações de permanência do livro com o usuário não foram encontradas!"
        );

      const currentDate = Date.now();
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const daysToAdd = checkoutInfo.checkout_limit;

      const due_back_dt = new Date(
        currentDate + daysToAdd * millisecondsInADay
      );

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
