import prisma from "../../../prisma/prisma";

class HoldService {
  static async execute(barcode_nmbr: string, mbrid: number) {
    const held = await prisma.$transaction( async (prisma) => {
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: barcode_nmbr,
        },
      });

      if (!copyExists) throw new Error("Livro não encontrado!");
      
      if (copyExists.status_cd !== 'out', copyExists.status_cd !== 'hld') throw new Error("Livro não está emprestado e não está em espera, você já pode fazer o checkout!");
      if (copyExists.mbrid === mbrid) throw new Error('Não foi possível realizar a reserva pois o livro já está com você!');

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

      let holdid = 1;

      const holdExists = await prisma.biblioHold.findMany({ where: {
        copyid: copyExists.id
      }});

      if(holdExists.length > 0){
        const holdAlreadyExists = holdExists.find((value) => {
            return value.mbrid === mbrid;
        });

        console.log(holdExists);
        console.log(holdAlreadyExists);
        if(holdAlreadyExists) throw new Error('O usuário já fez a reserva. Aguarde a sua vez!');
      }

      if(holdExists && holdExists.length > 0){
        const lastholdid = holdExists.reduce((prevHoldid, currentHoldid) => {
            return (prevHoldid.holdid > currentHoldid.holdid) ? prevHoldid : currentHoldid;
        });

        holdid = lastholdid.holdid + 1;
    };

      const held = await prisma.biblioHold.create({
        data: {
            holdid: holdid,
            copyid: copyExists.id,
            mbrid: memberExistis.mbrid,
            bibid: copyExists.bibid
        }
      });

      return held;
    });

    return held;
  }
}

export default HoldService;
