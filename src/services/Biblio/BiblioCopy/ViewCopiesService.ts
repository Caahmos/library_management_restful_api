import prisma from "../../../prisma/prisma";

class ViewCopiesService{
    static async execute(bibid: number){
        const copies = await prisma.biblioCopy.findMany({
            where: {
                bibid: bibid
            }
        });

        if(copies.length <= 0) throw new Error('Nenhuma cópia bibliográfica encontrada!');

        return copies;
    }
};

export default ViewCopiesService;