import { EditCollectionRequest } from "../../model/Collection/EditCollectionRequest";
import prisma from "../../prisma/prisma";

class EditCollectionService {
  static async execute(editCollectionData: EditCollectionRequest, code: number) {
    const colorsArray = [] as string[];

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
          NOT: {
            code: code,
          },
        },
      });

      if (collectionExists) throw new Error("Essa descrição já está em uso!");
    };

    if (editCollectionData.color1 || editCollectionData.color2) {
      editCollectionData.color1 && colorsArray.push(editCollectionData.color1);
      editCollectionData.color2 && colorsArray.push(editCollectionData.color2);
    };

    editCollectionData.colors = String(colorsArray);

    if(!editCollectionData.color1 && !editCollectionData.color2) {
      editCollectionData.colors = undefined;
    };

    delete editCollectionData.color1;
    delete editCollectionData.color2;

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
