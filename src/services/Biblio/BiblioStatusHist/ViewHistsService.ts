import { ViewHistsSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class ViewHistsService {
  static async execute(viewHoldData: ViewHistsSearch) {
    const { bibid, copyid, mbrid, due, status_cd, limit } = viewHoldData;

    const filters: any = {
      ...(bibid && { bibid }),
      ...(copyid && { copyid }),
      ...(mbrid && { mbrid }),
      ...(status_cd && { status_cd }),
    };

    console.log("Filtros finais:", filters);

    const foundHists = await prisma.biblioStatusHist.findMany({
      where: filters,
      orderBy: {
        status_begin_dt: "desc",
      },
      take: limit && limit > 0 ? limit : undefined,
    });

    if (foundHists.length === 0) {
      throw new Error("Nenhum histórico encontrado!");
    }

    const copyIds = [...new Set(foundHists.map(h => h.copyid))];

    const copyStatuses = await prisma.biblioCopy.findMany({
      where: { id: { in: copyIds } },
      select: { id: true, status_cd: true }
    });

    const statusMap = new Map(copyStatuses.map(copy => [copy.id, copy.status_cd]));

    const updatedHists = foundHists.map(hist => ({
      ...hist,
      status_cd: statusMap.get(hist.copyid) || hist.status_cd,
    }));

    return updatedHists;
  }
}

export default ViewHistsService;
