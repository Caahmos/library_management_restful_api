import { RegisterFieldRequest } from "../../../model/Member/MemberFieldsDM/RegisterFieldRequest";
import prisma from "../../../prisma/prisma";

class RegisterFieldService {
  static async execute(fieldData: RegisterFieldRequest) {
    const classifyExists = await prisma.memberFieldDM.findFirst({
      where: {
        code: fieldData.code,
      },
    });

    if (classifyExists)
      throw new Error("Já existe um campo com esse código!");

    const registeredClassify = await prisma.memberFieldDM.create({
      data: fieldData,
    });

    return registeredClassify;
  }
}

export default RegisterFieldService;
