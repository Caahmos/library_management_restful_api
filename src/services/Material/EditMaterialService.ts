import { EditMaterialRequest } from "../../model/Material/EditMaterialRequest";
import prisma from "../../prisma/prisma";
import fs from "node:fs";
import path from "node:path";

class EditMaterialService {
  static async execute(materialData: EditMaterialRequest, code: number) {
    const materialExists = await prisma.materialTypeDM.findFirst({
      where: {
        code: code,
      },
    });

    if (!materialExists?.code)
      throw new Error("Nenhuma classificação com esse id encontrado!");

    if (materialData.description) {
      const descriptionExists = await prisma.materialTypeDM.findFirst({
        where: {
          description: materialData.description,
        },
      });

      const currentImg = descriptionExists?.image_file;

      if (descriptionExists) {
        if (currentImg && materialData.image_file) {
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
      }

      if (descriptionExists) throw new Error("Essa descrição já está em uso!");
    }

    const currentImg = materialExists?.image_file;

      if (materialExists) {
        if (currentImg && materialData.image_file) {
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
              currentImg
            ),
            (err) => {
              if (err) console.log(err);
            }
          );
        }
      }

    const editedMaterial = await prisma.materialTypeDM.update({
      where: {
        code: code,
      },
      data: materialData,
    });

    return editedMaterial;
  }
}

export default EditMaterialService;
