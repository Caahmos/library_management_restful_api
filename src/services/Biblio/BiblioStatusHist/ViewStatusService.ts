import prisma from "../../../prisma/prisma";

class ViewStatusService {
  static async execute() {
    const statusDescription = await prisma.biblioStatusDM.findMany();

    if(statusDescription.length <= 0) throw new Error('Nenhum status encontrado!')

    return statusDescription;
  }
}

export default ViewStatusService;
