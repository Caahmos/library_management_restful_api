import cron from "node-cron";
import prisma from "../prisma/prisma";
import { startOfDay } from "date-fns";

async function blockOverdueMembers() {
  const today = startOfDay(new Date());

  try {
    const overdue = await prisma.biblioStatusHist.findMany({
      where: {
        due_back_dt: {
          lt: today,
        },
        returned_at: null,
        status_cd: "out",
      },
      select: {
        mbrid: true,
      },
      distinct: ["mbrid"],
    });

    const overdueMbrid = overdue.map((item) => item.mbrid);

    if (overdueMbrid.length > 0) {
      await prisma.member.updateMany({
        where: {
          mbrid: {
            in: overdueMbrid,
          },
        },
        data: {
          isBlocked: true,
        },
      });

      console.log(`Membros bloqueados: ${overdueMbrid.length}`);
    } else {
      console.log("Nenhum membro para bloquear hoje.");
    }
  } catch (error) {
    console.error("Erro ao bloquear membros:", error);
  }
}

cron.schedule("*/5 * * * * *", async () => {
  console.log("Executando job de bloqueio de membros...");
  await blockOverdueMembers();
});

export default blockOverdueMembers;
