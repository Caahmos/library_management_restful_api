import prisma from "../../../prisma/prisma";

class DetailBiblioService{
    static async execute(bibid: number){
        const biblio = await prisma.biblio.findFirst(
            {
                where: {
                    bibid: bibid
                },
                include: {
                    biblio_field: true
                }
            }
        );

        if(!biblio) throw new Error('Bibliografia não encontrada!');

        return biblio;
    }
};

export default DetailBiblioService;