import {
  EditMember,
  MemberFields,
} from "../../../model/Member/Member/EditMemberRequest";
import prisma from "../../../prisma/prisma";

class EditMemberService {
  static async execute(
    editMemberData: EditMember,
    mbrid: number,
    memberFields: MemberFields
  ) {
    const { code, data } = memberFields;

    if (editMemberData.barcode_nmbr) {
      const barCodeExists = await prisma.member.findFirst({
        where: {
          barcode_nmbr: editMemberData.barcode_nmbr,
          NOT: { mbrid: mbrid },
        },
      });
      if (barCodeExists)
        throw new Error("Código do cartão já está registrado.");
    }

    if (editMemberData.email) {
      const emailExists = await prisma.member.findFirst({
        where: {
          email: editMemberData.email,
          NOT: { mbrid: mbrid },
        },
      });
      if (emailExists) throw new Error("Esse email já está registrado.");
    }

    const editedMember = await prisma.$transaction(async (prisma) => {
      const member = await prisma.member.update({
        where: {
          mbrid: mbrid,
        },
        data: editMemberData,
      });

      if (code && data && code.length === data.length) {
        console.log("Entrou aqui");

        const existingCodes = await prisma.memberFieldDM.findMany({
          where: { code: { in: code } },
        });

        if (existingCodes.length !== code.length) {
          throw new Error(
            "Um ou mais códigos não estão cadastrados em MemberFieldDM!"
          );
        }

        const foundCodes = existingCodes.map((fieldDM) => fieldDM.code);

        const existingMemberFields = await prisma.memberField.findMany({
          where: {
            mbrid: member.mbrid,
            code: { in: foundCodes },
          },
        });

        const existingMemberFieldCodes = existingMemberFields.map(
          (field) => field.code
        );

        const fieldsToUpdate = existingMemberFields.map((field) => ({
          mbrid: field.mbrid,
          code: field.code,
          data: data[code.indexOf(field.code)],
        }));

        await Promise.all(
          fieldsToUpdate.map(async (field) => {
            await prisma.memberField.updateMany({
              where: { mbrid: field.mbrid, code: field.code },
              data: { data: field.data },
            });
          })
        );

        const newCodes = foundCodes.filter(
          (codeValue) => !existingMemberFieldCodes.includes(codeValue)
        );

        if (newCodes.length > 0) {
          const newMemberFields = newCodes.map((codeValue) => ({
            mbrid: member.mbrid,
            code: codeValue,
            data: data[code.indexOf(codeValue)],
          }));

          console.log("Novos campos a serem criados:", newMemberFields);

          await prisma.memberField.createMany({
            data: newMemberFields,
          });
        }
      }

      return member;
    });

    return editedMember;
  }
}

export default EditMemberService;
