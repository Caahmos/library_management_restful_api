import { ViewHistsSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class ViewHistsService {
  static async execute(viewHoldData: ViewHistsSearch) {
    const { bibid, copyid, mbrid, due, status_cd, limit } = viewHoldData;

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
        }
      },
    });

    if (foundHists.length === 0) {
      throw new Error("Nenhum histórico encontrado!");
    }

    return foundHists;
  }
}

export default ViewHistsService;
