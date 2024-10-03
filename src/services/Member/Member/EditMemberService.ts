import { EditMember, MemberFields } from "../../../model/Member/Member/EditMemberRequest";
import prisma from "../../../prisma/prisma";

class EditMemberService {
  static async execute(editMemberData: EditMember, mbrid: number, memberFields: MemberFields) {
    const {
      code,
      data,
    } = memberFields;

    if (editMemberData.barcode_nmbr) {
      const barCodeExists = await prisma.member.findFirst({
        where: { barcode_nmbr: editMemberData.barcode_nmbr },
      });
      if (barCodeExists)
        throw new Error("Código do cartão já está registrado.");
    }

    if (editMemberData.email) {
      const emailExists = await prisma.member.findFirst({
        where: { email: editMemberData.email },
      });
      if (emailExists) throw new Error("Esse email já está registrado.");
    }

    const editedMember = await prisma.$transaction(async (prisma) => {
      const member = await prisma.member.update({
        where: {
          mbrid: mbrid,
        },
        data: editMemberData
      });

      if (code && data && code.length === data.length) {
        console.log("Entrou aqui");
        const existingCodes = await prisma.memberFieldDM.findMany({
          where: { code: { in: code } },
        });

        if (existingCodes.length !== code.length) {
          throw new Error("Um ou mais códigos não estão cadastrados!");
        }

        const memberFields = code.map((codeValue, index) => ({
          mbrid: member.mbrid,
          code: codeValue,
          data: data[index],
        }));

        console.log(memberFields);

        await Promise.all(
            memberFields.map(async (field) => {
              await prisma.memberField.updateMany({
                where: { mbrid: field.mbrid, code: field.code },
                data: { data: field.data },
              });
            })
          );
      };

      return member;
    });

    return editedMember;
  }
}

export default EditMemberService;
