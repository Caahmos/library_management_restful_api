import prisma from "../../prisma/prisma";

class TopBooksService {
  static async execute() {
    // Obtendo os livros mais lidos, agrupados por bibid
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
      take: 50, // Pegando mais livros para garantir que tenhamos 10 livros válidos
    });

    const topBooksInformation = [];
    
    // Loop para garantir que tenhamos 10 livros válidos com dados completos
    for (const v of topBooks) {
      const bookDetails = await prisma.biblio.findFirst({
        where: {
          bibid: v.bibid,
        },
      });

      // Se não houver dados do livro, pula para o próximo livro
      if (!bookDetails) {
        continue;
      }

      // Adiciona o livro com informações completas
      topBooksInformation.push({
        bibid: v.bibid,
        count: v._count.bibid,
        title: bookDetails.title,
        author: bookDetails.author,
      });

      // Se já tivermos 10 livros válidos, sai do loop
      if (topBooksInformation.length >= 10) {
        break;
      }
    }

    // Garantindo que sempre tenha exatamente 10 livros
    return topBooksInformation;
  }
}

export default TopBooksService;
