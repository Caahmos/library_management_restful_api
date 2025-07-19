import { DetailHistsSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class DetailHistsService {
  static async execute(viewHoldData: DetailHistsSearch) {
    const { bibid, copy_barcode, member_barcode, due, status_cd, limit } = viewHoldData;
    let mbrid: number | undefined = undefined;
    let copyid: number | undefined = undefined;

    if(member_barcode){
      const memberExists = await prisma.member.findFirst({
        where: {
         barcode_nmbr: String(member_barcode)
        },
        select: {
          mbrid: true
        }
      });

      if(!memberExists) throw new Error('O membro não foi encontrado.');
      
      mbrid = memberExists?.mbrid;
    };
    
    if(copy_barcode){
      const copyExists = await prisma.biblioCopy.findFirst({
        where: {
         barcode_nmbr: String(copy_barcode)
        },
        select: {
          id: true
        }
      });

      if(!copyExists) throw new Error('A cópia não foi encontrada.');

      copyid = copyExists?.id;
    };

    const filters: any = {
      ...(bibid && { bibid }),
      ...(copyid && { copyid }),
      ...(mbrid && { mbrid }),
    };

    if (due === "yes") {
      filters.status_cd = "out";
      filters.due_back_dt = { lt: new Date() };
    } else if (status_cd) {
      filters.status_cd = status_cd;
    }

    const foundHists = await prisma.biblioStatusHist.findMany({
      where: filters,
      orderBy: {
        status_begin_dt: "desc",
      },
      take: limit && limit > 0 ? limit : undefined,
      include: {
        member: true,
        biblio_copy: {
          select: {
            barcode_nmbr: true
          }
        },
        biblio: {
          select: {
            title: true,
            title_remainder: true
          }
        }
      },
    });

    if (foundHists.length === 0) {
      throw new Error("Nenhum histórico encontrado!");
    }

    return foundHists;
  }
}

export default DetailHistsService;
