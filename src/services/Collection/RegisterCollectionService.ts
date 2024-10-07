import { RegisterCollectionRequest } from "../../model/Collection/RegisterCollectionRequest";
import prisma from "../../prisma/prisma";

class RegisterCollectionService {
  static async execute(collectionData: RegisterCollectionRequest) {
    const collectionExists = await prisma.collectionDM.findFirst({
      where: {
        description: collectionData.description,
      },
    });

    if (collectionExists)
      throw new Error("Já existe uma coleção com essa descrição!");

    const registeredCollection = await prisma.collectionDM.create({
      data: collectionData
    });

    return registeredCollection;
  }
}

export default RegisterCollectionService;
