import { DetailedSearchRequest } from "../../../model/Biblio/Biblio/DetailedSearchRequest";
import prisma from "../../../prisma/prisma";

class DetailedSearchService {
  static async execute(searchData: DetailedSearchRequest) {
    const { collection, date, order, take } = searchData;

    const whereClause: any = {};

    if (collection) {
      const collectionExists = await prisma.collectionDM.findFirst({
        where: {
          description: collection,
        },
        select: {
          code: true,
        },
      });

      if (!collectionExists) throw new Error("Coleção não encontrada!");

      whereClause.collection_cd = collectionExists.code;
    }

    let orderBy: any[] = [];

    if (order === "A-Z") {
      orderBy.push({ title: "asc" });
    } else if (order === "Z-A") {
      orderBy.push({ title: "desc" });
    }

    if (date === "asc") {
      orderBy.push({ createdAt: "asc" });
    } else if (date === "desc") {
      orderBy.push({ createdAt: "desc" });
    }

    if (orderBy.length === 0) {
      orderBy = [{ createdAt: "desc" }];
    }

    const biblios = await prisma.biblio.findMany({
      where: whereClause,
      orderBy,
      include: {
        biblio_copy: true,
        BiblioMedia: true,
      },
      take: Number(take),
    });

    if (!biblios || biblios.length === 0) {
      throw new Error("Nenhuma bibliografia encontrada com os filtros informados.");
    }


    return biblios;
  }
}

export default DetailedSearchService;
