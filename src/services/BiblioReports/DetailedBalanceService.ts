import { DetailHistsSearch } from "../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../prisma/prisma";

class DetailedBalanceService {
  static async execute(detailedBalance: DetailHistsSearch) {
    const { status_cd, limit } = detailedBalance;

    const isBroadAvailable = status_cd === 'crt' || status_cd === 'in';

    const whereClause = isBroadAvailable
      ? {
          NOT: {
            status_cd: {
              in: ['lst', 'mnd'],
            },
          },
        }
      : {
          status_cd: status_cd || 'out',
        };

    const detailed = await prisma.biblioCopy.findMany({
      where: whereClause,
      take: limit,
      include: {
        biblio: {
          select: {
            title: true,
            title_remainder: true,
            collection: {
              select: {
                description: true
              }
            }
          }
        }
      }
    });

    let statusCount;

    if (isBroadAvailable) {
      statusCount = await prisma.biblioCopy.count({
        where: {
          NOT: {
            status_cd: {
              in: ['lst', 'mnd'],
            },
          },
        },
      });
    } else {
      statusCount = await prisma.biblioCopy.count({
        where: whereClause,
      });
    }

    return {
      statusCount,
      detailed,
    };
  }
}

export default DetailedBalanceService;
