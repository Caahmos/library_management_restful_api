import prisma from "../../prisma/prisma";

class ViewSubfieldsService {
  static async execute(query: any) {
    const subfields = await prisma.usmarcSubfieldDM.findMany({
       where: {
            repeatable_flg: query.required ? true : false
       }
    });

    if (!subfields) throw new Error("Erro ao buscar subcampos Marc")!;

    return subfields;
  };
};

export default ViewSubfieldsService;
