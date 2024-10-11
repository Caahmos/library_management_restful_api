import {
  BiblioFieldRequest,
  BiblioRequest,
} from "../../../model/Biblio/Biblio/EditBiblioRequest";
import prisma from "../../../prisma/prisma";

class EditBiblioService {
  static async execute(
    editBiblioData: BiblioRequest,
    bibid: number,
    biblioFields: BiblioFieldRequest
  ) {
    const { indexes, tags, values, fieldIds, subfields } = biblioFields;

    if (editBiblioData.title) {
      const titleExists = await prisma.biblio.findFirst({
        where: { title: editBiblioData.title },
      });
      if (titleExists) {
        throw new Error("Esse título já está registrado.");
      }
    }

    const editedBiblio = await prisma.$transaction(async (prisma) => {
      const biblio = await prisma.biblio.update({
        where: { bibid: bibid },
        data: editBiblioData,
      });

      if (
        indexes &&
        values &&
        tags &&
        subfields &&
        fieldIds &&
        indexes.length > 0 &&
        Object.keys(values).length >= 0 &&
        Object.keys(values).length === indexes.length &&
        Object.keys(fieldIds).length === indexes.length
      ) {
        console.log("Entrou aqui");

        const fieldIdsArray = Object.values(fieldIds).map((id) => Number(id));

        console.log(fieldIdsArray);

        const existingFields = await prisma.biblioField.findMany({
          where: { id: { in: fieldIdsArray } },
        });

        console.log(existingFields);

        if (existingFields.length !== fieldIdsArray.length) {
          throw new Error(
            "Um ou mais fieldIds não estão cadastrados em biblioField!"
          );
        }

        await Promise.all(
          existingFields.map(async (field, i) => {
            const index = indexes[i];
            console.log(field.id)
            console.log(index)
            console.log(values[index])

            await prisma.biblioField.update({
              where: { id: field.id },
              data: {
                field_data: values[index],
              },
            });
          })
        );

        const newFields = fieldIdsArray.filter(
          (fieldId) =>
            !existingFields.some((field) => field.fieldid === fieldId)
        );

        if (newFields.length > 0) {
          const newbiblioFields = newFields.map((newFieldId, i) => ({
            fieldid: newFieldId,
            bibid: bibid,
            tag: Number(tags[indexes[i]]),
            subfield_cd: subfields[indexes[i]],
            field_data: values[indexes[i]]
          }));

          await prisma.biblioField.createMany({
            data: newbiblioFields,
          });
        }
      }

      return biblio;
    });

    return editedBiblio;
  }
}

export default EditBiblioService;