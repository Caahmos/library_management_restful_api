import { ViewHistSearch } from "../../../model/Biblio/BiblioStatusHist/ViewHistRequest";
import prisma from "../../../prisma/prisma";

class ViewHoldService {
  static async execute(viewHoldData: ViewHistSearch) {
    console.log(viewHoldData)

    // 🔹 Holds da fila (biblio_hold)
    const holds = await prisma.biblioHold.findMany({
      where: {
        bibid: viewHoldData.bibid || undefined,
        mbrid: viewHoldData.mbrid || undefined,
      },
      include: {
        biblio_copy: {
          select: {
            barcode_nmbr: true,
          },
        },
        member: {
          select: {
            mbrid: true,
            first_name: true,
            last_name: true,
            barcode_nmbr: true
          }
        },
        biblio: {
          select: {
            title: true,
          },
        },
      },
    });

    // 🔹 Primeiro da fila (biblio_status_hist)
    const histHolds = await prisma.biblioStatusHist.findMany({
      where: {
        status_cd: "hld",
        bibid: viewHoldData.bibid || undefined,
        mbrid: viewHoldData.mbrid || undefined,
      },
      include: {
        biblio_copy: {
          select: {
            barcode_nmbr: true,
          },
        },
        member: {
          select: {
            mbrid: true,
            first_name: true,
            last_name: true,
            barcode_nmbr: true
          }
        },
        biblio: {
          select: {
            title: true,
          },
        },
      },
    });

    // 🔹 Normaliza o primeiro da fila para o mesmo formato
    const normalizedHist = histHolds.map(hist => ({
      id: `hist-${hist.id}`, // evita conflito de id
      bibid: hist.bibid,
      mbrid: hist.mbrid,
      holdid: 0, // 0 = primeiro da fila
      created_at: hist.status_begin_dt,
      biblio_copy: hist.biblio_copy,
      biblio: hist.biblio,
      member: hist.member, // ✅ CORREÇÃO AQUI
      isPrimary: true,
    }));

    const normalizedHolds = holds.map(hold => ({
      ...hold,
      isPrimary: false,
    }));

    const result = [...normalizedHist, ...normalizedHolds];

    if (result.length === 0)
      throw new Error("Nenhuma reserva encontrada!");

    return result;
  }
}

export default ViewHoldService;