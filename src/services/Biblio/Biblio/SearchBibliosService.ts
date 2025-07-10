import { SearchBibliosRequest } from "../../../model/Biblio/Biblio/SearchBibliosRequest";
import prisma from "../../../prisma/prisma";

class SearchBibiosService {
  static async execute(searchData: SearchBibliosRequest) {
    const { method, data, limit } = searchData;
    let foundBiblio;

    if (!method && !data) {
      foundBiblio = await prisma.biblio.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          biblio_copy: true,
          BiblioMedia: true,
        },
        take: limit || 10,  
      });
    } else if (method === "title") {
      foundBiblio = await prisma.biblio.findMany({
        where: {
          title: {
            contains: data,            
          },
        },
        include: {
          biblio_copy: true,
          BiblioMedia: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit || 10,
      });
    } else if (method === "author") {
      foundBiblio = await prisma.biblio.findMany({
        where: {
          author: {
            contains: data
          },
        },
        include: {
          biblio_copy: true,
          BiblioMedia: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit || 10,
      });
    } else if (method === "collection") {
      const collectionExists = await prisma.collectionDM.findFirst({ 
        where: {
          description: data,
        },
      });

      if (!collectionExists) throw new Error("Coleção não encontrada!");

      foundBiblio = await prisma.biblio.findMany({
        where: {
          collection_cd: collectionExists.code,
        },
        include: {
          biblio_copy: true,
          BiblioMedia: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit || 10,
      });
    } 
    else if (method === "barcode") {
      const barcodeExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: (data)
        }
      })

      if (!barcodeExists) throw new Error("Coleção não encontrada!");

      foundBiblio = await prisma.biblio.findMany({
        where: {
          bibid: barcodeExists.bibid
        },
        include: {
          biblio_copy: true,
          BiblioMedia: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit || 10,
      });
    }
    else {
      throw new Error("Método de busca inválido!");
    }

    if (!foundBiblio || foundBiblio.length === 0) {
      throw new Error("Bibliografia não encontrada!");
    }

    return foundBiblio;
  }
}

export default SearchBibiosService;
