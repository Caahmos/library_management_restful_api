import { EditCopyRequest } from "../../../model/Biblio/BiblioCopy/EditCopyRequest";
import prisma from "../../../prisma/prisma";

class EditCopyService {
  static async execute(editCopyData: EditCopyRequest, id: number) {
    const existingCopy = await prisma.biblioCopy.findFirst({
      where: { id },
    });

    if (!existingCopy) {
      throw new Error("Nenhuma cópia com esse código encontrada!");
    }

    if (editCopyData.barcode_nmbr) {
      const barcodeAlreadyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: editCopyData.barcode_nmbr,
          id: { not: id },
        },
      });

      if (barcodeAlreadyExists) {
        throw new Error("Esse código de barras já está em uso!");
      }
    }

    if (editCopyData.status_cd) {
      const statusExists = await prisma.biblioStatusDM.findFirst({
        where: { code: editCopyData.status_cd },
      });

      if (!statusExists) {
        throw new Error("Esse status não existe!");
      }

      const statusPermitidos = ["in", "crt", "lst", "dis", "mnd"];
      const statusAtual = existingCopy.status_cd;
      const novoStatus = editCopyData.status_cd;

      const ambosPermitidos =
        statusPermitidos.includes(statusAtual) && statusPermitidos.includes(novoStatus);

      if (!ambosPermitidos) {
        throw new Error("Alteração de status não permitida.");
      }
    }

    const editedCopy = await prisma.biblioCopy.update({
      where: { id },
      data: editCopyData,
    });

    return editedCopy;
  }
}

export default EditCopyService;
