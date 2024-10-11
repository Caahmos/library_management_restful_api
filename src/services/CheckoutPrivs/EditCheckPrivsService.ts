import { EditCheckPrivRequest } from "../../model/CheckoutPrivs/EditCheckPrivRequest";
import prisma from "../../prisma/prisma";

class EditCheckPrivsService {
  static async execute(checkoutPrivData: EditCheckPrivRequest, id: number) {
    const checkPrivExists = await prisma.checkoutPrivs.findFirst({
      where: {
        id: id,
      },
    });

    if (!checkPrivExists)
      throw new Error("Tempo de permanência não foi encontrado!");

    const registeredCheckPriv = await prisma.checkoutPrivs.update({
      where: { id: id },
      data: checkoutPrivData,
    });

    return registeredCheckPriv;
  }
}

export default EditCheckPrivsService;
