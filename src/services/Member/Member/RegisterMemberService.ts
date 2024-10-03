import { RegisterMemberRequest } from "../../../model/Member/Member/RegisterMemberRequest";
import prisma from "../../../prisma/prisma";

class RegisterMemberService {
  static async execute(MemberData: RegisterMemberRequest) {
    const {
      first_name,
      last_name,
      barcode_nmbr,
      address,
      home_phone,
      work_phone,
      email,
      last_change_userid,
      code,
      data,
      classification,
    } = MemberData;

    const barCodeExists = await prisma.member.findFirst({
      where: { barcode_nmbr: barcode_nmbr },
    });
    if (barCodeExists) throw new Error("Código do cartão já está registrado.");

    const emailExists = await prisma.member.findFirst({
      where: { email: email },
    });
    if (emailExists) throw new Error("Esse email já está registrado.");

    const registeredMember = await prisma.$transaction(async (prisma) => {

      const member = await prisma.member.create({
        data: {
          first_name: first_name,
          last_name: last_name,
          barcode_nmbr: String(barcode_nmbr),
          address: address,
          home_phone: home_phone,
          work_phone: work_phone,
          email: email,
          classification: Number(classification),
          last_change_userid: last_change_userid,
        },
      });

      if (code && data && code.length === data.length) {
        console.log('Entrou aqui')
        const existingCodes = await prisma.memberFieldDM.findMany({
          where: { code: { in: code } },
        });

        if (existingCodes.length !== code.length) {
          throw new Error("Um ou mais códigos não estão cadastrados!");
        };

        const memberFields = code.map((codeValue, index) => ({
          mbrid: member.mbrid,
          code: codeValue,
          data: data[index],
        }));

        await prisma.memberField.createMany({ data: memberFields });
      }

      return member;
    });

    return registeredMember;
  }
}

export default RegisterMemberService;
