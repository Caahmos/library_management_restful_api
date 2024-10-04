import { RegisterMaterialRequest } from "../../model/Material/RegisterMaterialRequest";
import fs from 'node:fs';
import path from 'node:path';
import prisma from "../../prisma/prisma";

class RegisterMaterialService {
  static async execute(materialData: RegisterMaterialRequest) {
    const materialExists = await prisma.materialTypeDM.findFirst({
      where: {
        description: materialData.description,
      },
    });

    console.log(materialData.image_file)

    if (materialExists && materialData.image_file) {
      fs.unlink(
        path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "public",
          "assets",
          "imgs",
          "material",
          materialData.image_file
        ),
        (err) => {
          if (err) console.log(err);
        }
      );
    };

    if (materialExists)
      throw new Error("Já existe um material com essa descrição!");

    const registeredClassify = await prisma.materialTypeDM.create({
      data: materialData,
    });

    return registeredClassify;
  }
}

export default RegisterMaterialService;
