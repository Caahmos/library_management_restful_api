import { EditCollectionRequest } from "../../model/Collection/EditCollectionRequest";
import prisma from "../../prisma/prisma";

class EditCollectionService {
  static async execute(editCollectionData: EditCollectionRequest, code: number) {
    const collectionExists = await prisma.collectionDM.findFirst({
      where: {
        code: code
      }
    });

    if (!collectionExists?.code)
      throw new Error("Nenhuma coleção com esse código encontrada!");

    if (editCollectionData.description) {
      const collectionExists = await prisma.collectionDM.findFirst({
        where: {
          description: editCollectionData.description,
        },
      });

      if (collectionExists) throw new Error("Essa descrição já está em uso!");
    }

    const editedCollection = await prisma.collectionDM.update({
      where: {
        code: code,
      },
      data: editCollectionData,
    });

    return editedCollection;
  }
}

export default EditCollectionService;
