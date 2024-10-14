import prisma from "../../../prisma/prisma";

class RenewalService {
  static async execute(barcode_nmbr: string, mbrid: number) {
    const renewed = await prisma.$transaction( async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: barcode_nmbr,
        },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      if (copyExists.status_cd !== 'out') throw new Error("Livro não está emprestado no momento!");

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
      
      const renewal_count = copyExists.renewal_count + 1;

      if(checkoutInfo.renewal_limit < renewal_count) throw new Error('A quantidade máxima de renovações foram atingidas!');

      const renewed = await prisma.biblioStatusHist.create({
        data: {
          copyid: copyExists.id,
          due_back_dt: due_back_dt,
          mbrid: mbrid,
          bibid: copyExists.bibid,
          status_cd: "out",
          renewal_count: renewal_count
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
          renewal_count: renewal_count
        },
      });

      return renewed;
    });

    return renewed;
  }
}

export default RenewalService;
