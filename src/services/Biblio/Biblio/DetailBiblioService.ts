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

        const collection = await prisma.collectionDM.findFirst({
            where: {
                code: biblio.collection_cd
            },
            select: {
                description: true
            }
        });

        if(!collection) throw new Error('Nenhuma coleção encontrada com esse código');

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

        return {biblio, subfieldsDescriptions, collection};
    }
};

export default DetailBiblioService;