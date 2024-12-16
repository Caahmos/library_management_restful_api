import prisma from "../../../prisma/prisma";
import fs from "node:fs";
import path from "node:path";

class UpdateImageService {
  static async execute(image_file: string, bibid: number) {
    try {
      const addedImage = await prisma.$transaction(async (prisma) => {
        let media = await prisma.biblioMedia.findFirst({
          where: { bibid: bibid },
        });

      if (media && media.imageUrl && image_file) {
        fs.unlink(
          path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "assets",
            "imgs",
            "biblio",
            media.imageUrl
          ),
          (err) => {
            if (err) console.log(err);
          }
        );
      };

        if (!media) {
          media = await prisma.biblioMedia.create({
            data: {
              bibid: bibid,
              imageUrl: image_file, 
            },
          });
        } else {

          media = await prisma.biblioMedia.update({
            where: { id: media.id },
            data: { imageUrl: image_file },
          });
        }

        return media;
      });

      return addedImage;
    } catch (error) {
      console.error("Erro ao atualizar/criar a imagem:", error);
      throw new Error("Erro ao atualizar ou criar imagem.");
    }
  }
}

export default UpdateImageService;
