import prisma from "../../../prisma/prisma";

class DeleteBiblioService{
  static async execute(bibid: number) {
    const biblioExists = await prisma.biblio.findFirst({
      where: {
        bibid: bibid,
      },
    });

    if (!biblioExists) throw new Error("Nenhuma bibliografia com esse id encontrada!");

    const deletedBiblio = await prisma.biblio.delete({
      where: {
        bibid: bibid,
      }
    });

    return deletedBiblio;
  }
}

export default DeleteBiblioService;
