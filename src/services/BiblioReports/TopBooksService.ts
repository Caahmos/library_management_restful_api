import prisma from "../../prisma/prisma";

class TopBooksService {
  static async execute() {

    const topBooks = await prisma.biblioStatusHist.groupBy({
      by: ['bibid'],
      _count: {
        bibid: true,
      },
      orderBy: {
        _count: {
          bibid: 'desc',
        },
      },
      take: 50,
    });

    const topBooksInformation = [];
    
    
    for (const book of topBooks) {
      const bookDetails = await prisma.biblio.findFirst({
        where: {
          bibid: book.bibid,
        },
      });

      
      if (!bookDetails) {
        continue;
      }

      
      topBooksInformation.push({
        bibid: book.bibid,
        count: book._count.bibid,
        title: bookDetails.title,
        author: bookDetails.author,
      });

      
      if (topBooksInformation.length >= 10) {
        break;
      }
    }

    return topBooksInformation;
  }
}

export default TopBooksService;
