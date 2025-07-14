import prisma from "../../prisma/prisma";

class MemberRanksService {
  static async execute(collection_cd?: number, mbrid?: number, limit?: number) {
    
    const allRecords = await prisma.biblioStatusHist.findMany({
      where: collection_cd ? { biblio: { collection_cd } } : {},
      select: {
        mbrid: true,
        bibid: true,
        status_begin_dt: true,
        ...(collection_cd ? { 
          biblio: {
            select: {
              collection_cd: true,
            },
          },
        } : {}),
      },
      orderBy: {
        status_begin_dt: 'asc',
      },
      distinct: ['mbrid', 'bibid'], 
    });

    const globalMemberStats = allRecords.reduce((acc, { mbrid, status_begin_dt }) => {
      if (!mbrid) return acc;
      
      if (!acc.has(mbrid)) {
        acc.set(mbrid, {
          count: 1,
          earliestDate: status_begin_dt
        });
      } else {
        const current = acc.get(mbrid)!;
        acc.set(mbrid, {
          count: current.count + 1,
          earliestDate: status_begin_dt < current.earliestDate 
            ? status_begin_dt 
            : current.earliestDate
        });
      }
      return acc;
    }, new Map<number, { count: number, earliestDate: Date }>());

    const globalRankedResults = Array.from(globalMemberStats.entries())
      .map(([mbrid, { count, earliestDate }]) => ({
        mbrid,
        totalBooksBorrowed: count,
        earliestDate
      }))
      .sort((a, b) => {
        if (b.totalBooksBorrowed !== a.totalBooksBorrowed) {
          return b.totalBooksBorrowed - a.totalBooksBorrowed;
        }
        return a.earliestDate.getTime() - b.earliestDate.getTime();
      });

    let currentRank = 1;
    const globalRanking = globalRankedResults.map((member, index, array) => {
      if (index > 0 && 
          (member.totalBooksBorrowed !== array[index-1].totalBooksBorrowed ||
           member.earliestDate.getTime() !== array[index-1].earliestDate.getTime())) {
        currentRank = index + 1;
      }
      return {
        ...member,
        rank: currentRank,
      };
    });

    let finalResults = globalRanking;
    if (mbrid) {
      finalResults = globalRanking.filter(member => member.mbrid === mbrid);
    }

    return limit ? finalResults.slice(0, limit) : finalResults;
  }
}

export default MemberRanksService;