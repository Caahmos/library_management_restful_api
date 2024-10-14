import prisma from "../../../prisma/prisma";

class DetailCopyService{
    static async execute(id: number){
        const copy = await prisma.biblioCopy.findFirst(
            {
                where: {
                    id: id
                }
            }
        );

        if(!copy) throw new Error('Cópia bibliográfica não encontrada!');

        return copy;
    }
};

export default DetailCopyService;