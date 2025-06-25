import { RegisterBiblioRequest } from "../../../model/Biblio/Biblio/RegisterBiblioRequest";
import prisma from "../../../prisma/prisma";

class RegisterBiblioService {
  static async execute(biblioData: RegisterBiblioRequest) {
    let {
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

    const tryGetFromValues = (code: string): string | undefined => {
      return values?.[code]?.trim() || undefined;
    };

    if (!title) title = tryGetFromValues("245a") || "";
    if (!author) author = tryGetFromValues("100a") || "";
    if (!call_nmbr1)
      call_nmbr1 = tryGetFromValues("090a") || tryGetFromValues("099a") || "";
    if (!title_remainder)
      title_remainder = tryGetFromValues("245b") || undefined;
    if (!responsibility_stmt)
      responsibility_stmt = tryGetFromValues("245c") || undefined;

    if (!material_cd) throw new Error("Escolha uma das opções de materiais!");
    if (!collection_cd) throw new Error("Escolha uma das opções de coleções!");
    material_cd = Number(material_cd);
    collection_cd = Number(collection_cd);
    last_change_userid = Number(last_change_userid);
    if (!call_nmbr1)
      throw new Error("Informe o número de chamada (call number)!");
    if (!title) throw new Error("Informe o título!");
    if (!author) throw new Error("Informe o nome do autor!");

    if (requiredFlgs && values) {
      const missingFields: string[] = [];

      for (const [key, required] of Object.entries(requiredFlgs)) {
        if (required === "1" && (!values[key] || values[key].trim() === "")) {
          missingFields.push(key);
        }
      }

      if (missingFields.length > 0) {
        throw new Error(
          `Os seguintes campos obrigatórios estão vazios: ${missingFields.join(
            ", "
          )}`
        );
      }
    }

    const titleExists = await prisma.biblio.findFirst({
      where: { title },
    });

    if (titleExists) throw new Error("O título já está cadastrado!");

    const registeredBibliography = await prisma.$transaction(async (tx) => {
      const biblio = await tx.biblio.create({
        data: {
          author,
          call_nmbr1,
          title,
          material_cd,
          collection_cd,
          last_change_userid,
          call_nmbr2,
          call_nmbr3,
          title_remainder,
          topic1,
          topic2,
          topic3,
          topic4,
          topic5,
          responsibility_stmt,
          opac_flg,
        },
      });

      if (
        indexes?.length &&
        values &&
        tags &&
        subfields &&
        indexes.length === Object.keys(values).length
      ) {
        let fieldIndex = 0;

        const marcFields = indexes.map((index) => ({
          fieldid: fieldIndex++,
          bibid: biblio.bibid,
          tag: Number(tags[index]),
          subfield_cd: subfields[index],
          field_data: values[index],
        }));

        console.log(marcFields)
        await tx.biblioField.createMany({ data: marcFields });
      }

      await tx.biblioMedia.create({ data: { bibid: biblio.bibid } });

      return biblio;
    });

    return registeredBibliography;
  }
}

export default RegisterBiblioService;
