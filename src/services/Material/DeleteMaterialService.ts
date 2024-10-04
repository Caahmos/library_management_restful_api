import prisma from "../../prisma/prisma";
import fs from 'node:fs';
import path from 'node:path';

class DeleteMaterialService {
  static async execute(code: number) {
    const materialExists = await prisma.materialTypeDM.findFirst({
      where: {
        code: code,
      },
    });

    if (!materialExists?.code) throw new Error("Nenhum material com esse id encontrado!");

    const deletedMaterial = await prisma.materialTypeDM.delete({
      where: {
        code: code,
      },
    });

    const currentImg = deletedMaterial?.image_file;

    if (materialExists && currentImg) {
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

    return deletedMaterial;
  }
}

export default DeleteMaterialService;
