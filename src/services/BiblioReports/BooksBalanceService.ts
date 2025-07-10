import prisma from "../../prisma/prisma";

class BooksBalanceService {
  static async execute() {
    
    const groupedByStatus = await prisma.biblioCopy.groupBy({
      by: ['status_cd'],
      _count: {
        copyid: true,
      },
    });

    const totalCopies = await prisma.biblioCopy.count();

    return {
      total: totalCopies,
      statusCounts: groupedByStatus.map((status) => ({
        status: status.status_cd,
        count: status._count.copyid,
      })),
    };
  }
}

export default BooksBalanceService;
