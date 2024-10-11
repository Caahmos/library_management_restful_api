import { RegisterClassifyRequest } from "../../../model/Member/MemberClassifyDM/RegisterClassifyRequest";
import prisma from "../../../prisma/prisma";

class RegisterClassifyService {
  static async execute(classifyData: RegisterClassifyRequest) {
    const registeredClassify = await prisma.$transaction(async (prisma) => {
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

      const materials = await prisma.materialTypeDM.findMany({
        select: {
          code: true,
        },
      });

      await Promise.all(
        materials.map(async (material) => {
          await prisma.checkoutPrivs.create({
            data: {
              material_cd: material.code,
              classification: registeredClassify.code,
              checkout_limit: 10,
              renewal_limit: 0,
            },
          });
        })
      );

      return registeredClassify;
    });

    return registeredClassify;
  }
}

export default RegisterClassifyService;
