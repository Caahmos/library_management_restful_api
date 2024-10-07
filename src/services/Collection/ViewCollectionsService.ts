import prisma from "../../prisma/prisma";

class ViewCollectionsService{
    static async execute(){
        const collections = await prisma.collectionDM.findMany();

        if(collections.length <= 0) throw new Error('Nenhuma coleção encontrada!');

        return collections;
    }
};

export default ViewCollectionsService;