import prisma from "../../../prisma/prisma";
import fs from "node:fs";
import path from "node:path";

class UpdateMemberImageService {
  static async execute(image_file: string, mbrid: number) {
    try {
      const addedImage = await prisma.$transaction(async (prisma) => {
        let member = await prisma.member.findFirst({
          where: { mbrid: mbrid },
        });

      if (member && member.imageUrl && image_file) {
        fs.unlink(
          path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "assets",
            "imgs",
            "member",
            member.imageUrl
          ),
          (err) => {
            if (err) console.log(err);
          }
        );
      };

        if (!member) {
          throw new Error('Nenhum membro com esse id encontrado.');
        } else {

          member = await prisma.member.update({
            where: { mbrid: member.mbrid },
            data: { imageUrl: image_file },
          });
        }

        return member;
      });

      return addedImage;
    } catch (error) {
      console.error("Erro ao atualizar/criar a imagem:", error);
      throw new Error("Erro ao atualizar ou criar imagem.");
    }
  }
}

export default UpdateMemberImageService;
