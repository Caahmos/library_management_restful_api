import prisma from "../../../prisma/prisma";
import fs from "node:fs";
import path from "node:path";

class AddImageService {
  static async execute(image_file: string, bibid: number) {
      const mediaExists = await prisma.biblioMedia.findFirst({
        where: {
          bibid: bibid,
        },
      });

      if(!mediaExists) throw new Error('Nenhum mídia com essa bibid foi encontrada!');

      if (mediaExists.imageUrl && image_file) {
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
            mediaExists.imageUrl
          ),
          (err) => {
            if (err) console.log(err);
          }
        );
      };

      console.log(image_file);

      const addedImage = await prisma.biblioMedia.update({ 
        where: {
            id: mediaExists.id
        },
        data: {
            imageUrl: image_file
        }
      });

    return addedImage;
  }
}

export default AddImageService;
