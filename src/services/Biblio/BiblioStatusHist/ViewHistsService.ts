import { ViewHistsSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class ViewHistsService {
  static async execute(viewHoldData: ViewHistsSearch) {
    const { bibid, mbrid, due, status_cd, limit } = viewHoldData;

    const notReturnedStatus = ["out", "ln", "hld", "ord"];

    const filters: any = {
      ...(bibid && { bibid }),
      ...(mbrid && { mbrid }),
      ...(status_cd && { status_cd }),
    };

    if (due) {
      if (status_cd && !notReturnedStatus.includes(status_cd)) {
        throw new Error(
          "O status fornecido não é considerado como não devolvido."
        );
      }

      filters.status_cd = { in: notReturnedStatus };
      filters.due_back_dt = { lt: new Date() };
    }

    console.log("Filtros finais:", filters);

    const foundHists = await prisma.biblioStatusHist.findMany({
      where: filters,
      orderBy: {
        due_back_dt: "desc",
      },
      take: limit && limit > 0 ? limit : undefined,
    });

    if (foundHists.length === 0) {
      throw new Error("Nenhum histórico encontrado!");
    }

    return foundHists;
  }
}

export default ViewHistsService;
