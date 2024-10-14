import prisma from "../../../prisma/prisma";

class ViewCopiesService{
    static async execute(){
        const copies = await prisma.biblioCopy.findMany();

        if(copies.length <= 0) throw new Error('Nenhuma cópia bibliográfica encontrada!');

        return copies;
    }
};

export default ViewCopiesService;