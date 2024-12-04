import prisma from "../../../prisma/prisma";

class DetailBiblioService{
    static async execute(bibid: number){
        const biblio = await prisma.biblio.findFirst(
            {
                where: {
                    bibid: bibid
                },
                include: {
                    biblio_field: true,
                    BiblioMedia: true,
                    BiblioRank: true,
                }
            }
        );

        if(!biblio) throw new Error('Bibliografia não encontrada!');

        const subfieldsDescriptions = await Promise.all(
            biblio.biblio_field.map(async (value) => {
                const subfieldDescription = await prisma.usmarcSubfieldDM.findFirst({
                    where: {
                        tag: value.tag,
                        subfield_cd: value.subfield_cd
                    },
                    select: {
                        description: true
                    }
                });
                return subfieldDescription?.description || "Descrição não encontrada";
            })
        );

        console.log(subfieldsDescriptions)

        return {biblio, subfieldsDescriptions};
    }
};

export default DetailBiblioService;