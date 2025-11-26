import prisma from "../../../prisma/prisma";

class OverdueHistsService {
  static async execute(limit?: number, order: "asc" | "desc" = "asc") {
    const foundHists = await prisma.biblioStatusHist.findMany({
      where: {
        status_cd: "out",
        due_back_dt: { lt: new Date() },
      },
      orderBy: {
        due_back_dt: order,
      },
      take: limit && limit > 0 ? limit : undefined,

      select: {
        status_begin_dt: true,
        due_back_dt: true,

        member: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            barcode_nmbr: true,
            member_fields: {
              select: {
                code: true,
                data: true,
              },
            },
          },
        },

        biblio_copy: {
          select: {
            barcode_nmbr: true,
          },
        },

        biblio: {
          select: {
            title: true,
            title_remainder: true,
          },
        },
      },
    });

    if (!foundHists.length) {
      throw new Error("Nenhum item atrasado encontrado!");
    }

    const result = foundHists.map((hist) => {
      if (!hist.due_back_dt) {
        throw new Error("Registro inválido: due_back_dt está null!");
      }

      const now = new Date();
      const dueDate = new Date(hist.due_back_dt);
      const diffMs = now.getTime() - dueDate.getTime();
      const dias_atraso = Math.max(0, Math.floor(diffMs / 86400000));

      // 🔥 Flatten dos campos extras
      const camposExtras: Record<string, string> = {};

      for (const field of hist.member.member_fields) {
        const chave = field.code.replace(/\s+/g, "_");
        camposExtras[chave] = field.data ?? "";
      }

      // 🔥 Monta o objeto original
      const data = {
        nome: hist.member.first_name,
        sobrenome: hist.member.last_name,
        email: hist.member.email,
        rm: hist.member.barcode_nmbr,

        ...camposExtras,

        dias_atraso,

        codigo_copia: hist.biblio_copy?.barcode_nmbr ?? "",
        titulo: hist.biblio.title,
        subtitulo: hist.biblio.title_remainder ?? "",
      };

      // 🔥 Remove somente campos == ""
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== "")
      );

      return cleaned;
    });

    return result;
  }
}

export default OverdueHistsService;