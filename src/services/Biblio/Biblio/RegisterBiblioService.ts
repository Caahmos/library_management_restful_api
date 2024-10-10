import { RegisterBiblioRequest } from "../../../model/Biblio/Biblio/RegisterBiblioRequest";
import prisma from "../../../prisma/prisma";

class RegisterBiblioService {
  static async execute(biblioData: RegisterBiblioRequest) {
    const {
      author,
      call_nmbr1,
      collection_cd,
      last_change_userid,
      material_cd,
      opac_flg,
      title,
      call_nmbr2,
      call_nmbr3,
      title_remainder,
      topic1,
      topic2,
      topic3,
      topic4,
      topic5,
      values,
      indexes,
      tags,
      subfields,
      fieldIds,
      requiredFlgs,
      responsibility_stmt,
    } = biblioData;

    const titleExists = await prisma.biblio.findFirst({
      where: {
        title: title,
      },
    });

    if (titleExists) throw new Error("O título já está cadastrado!");

    const registeredBibliography = await prisma.$transaction(async (prisma) => {
      const biblio = await prisma.biblio.create({
        data: {
          author: author,
          call_nmbr1: call_nmbr1,
          title: title,
          material_cd: material_cd,
          collection_cd: collection_cd,
          last_change_userid: last_change_userid,
          call_nmbr2: call_nmbr2,
          call_nmbr3: call_nmbr3,
          title_remainder: title_remainder,
          topic1: topic1,
          topic2: topic2,
          topic3: topic3,
          topic4: topic4,
          topic5: topic5,
          responsibility_stmt: responsibility_stmt,
          opac_flg: opac_flg,
        },
      });

    if (
      indexes &&
      values &&
      tags &&
      subfields &&
      indexes.length > 0 &&
      Object.keys(values).length >= 0 &&
      Object.keys(values).length === indexes.length
    ) {
      let fieldIndex = 0;
      const editedFields = indexes.map((index, i) => {
        return {
          fieldid: fieldIndex++,
          bibid: biblio.bibid,
          tag: Number(tags[index]),
          subfield_cd: subfields[index],
          field_data: values[index],
        };
      });

      await prisma.biblioField.createMany({
        data: editedFields
      });

      console.log(editedFields);

      return biblio;
    }
  });

    return registeredBibliography;
  }
}

export default RegisterBiblioService;
