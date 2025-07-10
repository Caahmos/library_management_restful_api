import prisma from "../../prisma/prisma";
import { subMonths, startOfDay } from "date-fns";

class MemberBalanceService {
  static async execute() {
    const total = await prisma.member.count();

    const blocked = await prisma.member.count({
      where: {
        isBlocked: true,
      },
    });

    const active = total - blocked;

    const threeMonthsAgo = startOfDay(subMonths(new Date(), 3));

    const recentActivity = await prisma.biblioStatusHist.findMany({
      where: {
        status_cd: 'out',
        status_begin_dt: {
          gte: threeMonthsAgo,
        },
      },
      select: {
        mbrid: true,
      },
      distinct: ['mbrid'],
    });

    const activeMembers = recentActivity.map((item) => item.mbrid);

    return {
      total,
      blocked,
      active,
      recent: activeMembers.length,
    };
  }
}

export default MemberBalanceService;
