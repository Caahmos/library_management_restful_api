import { RegisterClassifyRequest } from "../../../model/Member/MemberClassifyDM/RegisterClassifyRequest";
import prisma from "../../../prisma/prisma";

class RegisterClassifyService {
  static async execute(classifyData: RegisterClassifyRequest) {
    const classifyExists = await prisma.memberClassifyDM.findFirst({
      where: {
        description: classifyData.description,
      },
    });

    if (classifyExists)
      throw new Error("Já existe um tipo com essa descrição!");

    const registeredClassify = await prisma.memberClassifyDM.create({
      data: classifyData,
    });

    return registeredClassify;
  }
}

export default RegisterClassifyService;
