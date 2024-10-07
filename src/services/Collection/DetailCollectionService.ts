import prisma from "../../prisma/prisma";

class DetailCollectionService{
    static async execute(code: number){
        const collection = await prisma.collectionDM.findFirst(
            {
                where: {
                    code: code
                }
            }
        );

        if(!collection) throw new Error('Coleção não encontrada!');

        return collection;
    }
};

export default DetailCollectionService;