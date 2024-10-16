import prisma from "../../../prisma/prisma";

class ViewHistService{
    static async execute(bibid: number){
        const foundHist = await prisma.biblioStatusHist.findMany(
            {
                where: {
                    bibid: bibid
                }
            }
        );

        if(foundHist.length <= 0) throw new Error('Histórico não encontrado!');

        return foundHist;
    }
};

export default ViewHistService;