import cron from "node-cron";
import prisma from "../prisma/prisma";
import { startOfDay, addDays, isAfter } from "date-fns";

async function blockOverdueMembers() {
  const today = startOfDay(new Date());

  try {
    const overdueLoans = await prisma.biblioStatusHist.findMany({
      where: {
        due_back_dt: {
          lt: today,
        },
        returned_at: null,
        status_cd: "out",
      },
      select: {
        mbrid: true,
        due_back_dt: true,
        biblio: {
          select: {
            material_cd: true,
          },
        },
        member: {
          select: {
            classification: true,
          },
        },
      },
    });

    const mbridToBlock = new Set<number>();

    for (const loan of overdueLoans) {
      const { mbrid, due_back_dt, biblio, member } = loan;

      if (!biblio?.material_cd || !member?.classification || !due_back_dt)
        continue;

      const checkoutPriv = await prisma.checkoutPrivs.findFirst({
        where: {
          classification: member.classification,
          material_cd: biblio.material_cd,
        },
        select: {
          grace_period_days: true,
        },
      });

      const grace = checkoutPriv?.grace_period_days ?? 0;
      const graceLimit = addDays(due_back_dt, grace);

      if (isAfter(today, graceLimit)) {
        mbridToBlock.add(mbrid);
      }
    }

    if (mbridToBlock.size > 0) {
      await prisma.member.updateMany({
        where: {
          mbrid: {
            in: Array.from(mbridToBlock),
          },
        },
        data: {
          isBlocked: true,
        },
      });

      console.log(`Membros bloqueados: ${mbridToBlock.size}`);
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
