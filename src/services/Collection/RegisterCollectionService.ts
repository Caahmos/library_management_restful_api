import { RegisterCollectionRequest } from "../../model/Collection/RegisterCollectionRequest";
import prisma from "../../prisma/prisma";

class RegisterCollectionService {
  static async execute(collectionData: RegisterCollectionRequest) {
    const colorsArray = [] as string[];
    const collectionExists = await prisma.collectionDM.findFirst({
      where: {
        description: collectionData.description,
      },
    });

    if (collectionExists)
      throw new Error("Já existe uma coleção com essa descrição!");

    if (collectionData.color1 || collectionData.color2) {
      collectionData.color1 && colorsArray.push(collectionData.color1);
      collectionData.color2 && colorsArray.push(collectionData.color2);
    };

    collectionData.colors = String(colorsArray);

    if(!collectionData.color1 && !collectionData.color2) {
      collectionData.colors = undefined;
    }

    delete collectionData.color1;
    delete collectionData.color2;

    const registeredCollection = await prisma.collectionDM.create({
      data: collectionData
    });

    return registeredCollection;
  }
}

export default RegisterCollectionService;
