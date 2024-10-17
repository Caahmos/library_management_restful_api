import { ViewHistSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class ViewHistService {
  static async execute(viewHistData: ViewHistSearch) {
    const foundHist = await prisma.biblioStatusHist.findMany({
      where: {
        bibid: viewHistData.bibid || undefined,
        mbrid: viewHistData.mbrid || undefined,
      },
    });

    if(foundHist.length <= 0) throw new Error('Nenhum histórico encontrado!')

    return foundHist;
  }
}

export default ViewHistService;
