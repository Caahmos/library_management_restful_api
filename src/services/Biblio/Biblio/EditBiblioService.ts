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
    const { indexes, tags, values, subfields } = biblioFields;

    if (editBiblioData.title) {
      const titleExists = await prisma.biblio.findFirst({
        where: { title: editBiblioData.title, bibid: { not: bibid } },
      });
      if (titleExists) {
        throw new Error("Esse título já está registrado.");
      }
    }

    const editedBiblio = await prisma.$transaction(async (tx) => {
      const biblio = await tx.biblio.update({
        where: { bibid },
        data: editBiblioData,
      });

      if (indexes && tags && values && subfields) {
        const existingFields = await tx.biblioField.findMany({
          where: { bibid },
        });

        let maxFieldId = Math.max(
          0,
          ...existingFields.map((f) => f.fieldid ?? 0)
        );

        const updates: Promise<any>[] = [];
        const inserts: any[] = [];

        for (const index of indexes) {
          const tag = Number(tags[index]);
          const subfield_cd = subfields[index];
          const field_data = values[index]?.trim();

          const existing = existingFields.find(
            (f) => f.tag === tag && f.subfield_cd === subfield_cd
          );

          if (existing) {
            updates.push(
              tx.biblioField.update({
                where: { id: existing.id },
                data: { field_data },
              })
            );
          } else if (field_data && field_data !== "") {
            maxFieldId += 1;
            inserts.push({
              bibid,
              tag,
              subfield_cd,
              field_data,
              fieldid: maxFieldId,
            });
          }
        }

        if (updates.length > 0) await Promise.all(updates);
        if (inserts.length > 0) await tx.biblioField.createMany({ data: inserts });
      }

      return biblio;
    });

    return editedBiblio;
  }
}

export default EditBiblioService;