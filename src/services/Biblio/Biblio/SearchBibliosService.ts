import { SearchBibliosRequest } from "../../../model/Biblio/Biblio/SearchBibliosRequest";
import prisma from "../../../prisma/prisma";

class SearchBibiosService {
  static async execute(searchData: SearchBibliosRequest) {
    const { method, data } = searchData;
    let foundBiblio;

    if (method === "title") {
      foundBiblio = await prisma.biblio.findMany({
        where: {
          title: {
            contains: data,            
          },
        },
        include: {
            biblio_copy: true
        }
      });
    } else if (method === "author") {
      foundBiblio = await prisma.biblio.findFirst({
        where: {
          author: data
        },
        include: {
            biblio_copy: true
        }
      });
    } else if (method === "collection") {
      const collectionExists = await prisma.collectionDM.findFirst({ 
        where: {
            description: data
        }
      })

      if(!collectionExists) throw new Error('Coleção não encontrada!');

      foundBiblio = await prisma.biblio.findFirst({
        where: {
          collection_cd: collectionExists.code
        },
        include: {
            biblio_copy: true
        }
      });
    } else {
      throw new Error("Método de busca inválido!");
    }

    if (!foundBiblio) {
      throw new Error("Bibliografia não encontrada!");
    }

    return foundBiblio;
  }
}

export default SearchBibiosService;
