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
      where: {
        barcode_nmbr: barcode_nmbr,
      },
    });

    if (barCodeExists) throw new Error("Código do cartão já está registrado.");

    const emailExists = await prisma.member.findFirst({
      where: {
        email: email,
      },
    });

    if (emailExists) throw new Error("Essa email já está registrado.");

    const registeredMember = await prisma.member.create({
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

    if (registeredMember && code && data && code.length === data.length) {
      const existingCodes = await prisma.memberFieldDM.findMany({
        where: { code: { in: code } },
      });

      if (existingCodes.length !== code.length) {
        throw new Error("Um ou mais códigos não estão cadastrados!");
      }

      const editedField = code.map((code, index) => {
        return {
          mbrid: registeredMember.mbrid,
          code: code,
          data: data[index],
        };
      });

      const registeredField = await prisma.memberField.createMany({
        data: editedField,
      });

      console.log(registeredField);
    }

    return registeredMember;
  }
}

export default RegisterMemberService;
