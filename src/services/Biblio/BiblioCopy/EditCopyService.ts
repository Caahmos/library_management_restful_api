import { EditCopyRequest } from "../../../model/Biblio/BiblioCopy/EditCopyRequest";
import prisma from "../../../prisma/prisma";

class EditCopyService {
  static async execute(editCopyData: EditCopyRequest, id: number) {
    const idExists = await prisma.biblioCopy.findFirst({
      where: {
        id: id
      }
    });

    if (!idExists)
      throw new Error("Nenhuma cópia com esse código encontrada!");

    if (editCopyData.barcode_nmbr) {
      const barcodeAlreadyExists = await prisma.biblioCopy.findFirst({
        where: {
          barcode_nmbr: editCopyData.barcode_nmbr,
        },
      });

      if (barcodeAlreadyExists) throw new Error("Esse código de barras já está em uso!");
    };
    
    if (editCopyData.status_cd) {
      const statusExists = await prisma.biblioStatusDM.findFirst({
        where: {
          code: editCopyData.status_cd,
        },
      });

      if (!statusExists) throw new Error("Esse status não existe!");
    };

    const editedCopy = await prisma.biblioCopy.update({
      where: {
        id: id,
      },
      data: editCopyData,
    });

    return editedCopy;
  }
}

export default EditCopyService;
