import { RegisterMaterialRequest } from "../../model/Material/RegisterMaterialRequest";
import fs from "node:fs";
import path from "node:path";
import prisma from "../../prisma/prisma";

class RegisterMaterialService {
  static async execute(materialData: RegisterMaterialRequest) {
    const registeredMaterial = await prisma.$transaction(async (prisma) => {
      const materialExists = await prisma.materialTypeDM.findFirst({
        where: {
          description: materialData.description,
        },
      });

      console.log(materialData.image_file);

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
      }

      if (materialExists)
        throw new Error("Já existe um material com essa descrição!");

      const registeredMaterial = await prisma.materialTypeDM.create({
        data: materialData,
      });

      const classifies = await prisma.memberClassifyDM.findMany({
        select: {
          code: true,
        },
      });

      await Promise.all(
        classifies.map(async (classify) => {
          await prisma.checkoutPrivs.create({
            data: {
              material_cd: registeredMaterial.code,
              classification: classify.code,
              checkout_limit: 10,
              days_due_back: 14,
              renewal_limit: 0,
            },
          });
        })
      );

      return registeredMaterial;
    });

    return registeredMaterial;
  }
}

export default RegisterMaterialService;
