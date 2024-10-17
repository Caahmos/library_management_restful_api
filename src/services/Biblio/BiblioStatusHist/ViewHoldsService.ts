import { ViewHistSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class ViewHoldService {
  static async execute(viewHoldData: ViewHistSearch) {
    const foundHold = await prisma.biblioHold.findMany({
      where: {
        bibid: viewHoldData.bibid || undefined,
        mbrid: viewHoldData.mbrid || undefined,
      },
    });

    if(foundHold.length <= 0) throw new Error('Nenhuma reserva encontrada encontrado!')

    return foundHold;
  }
}

export default ViewHoldService;
