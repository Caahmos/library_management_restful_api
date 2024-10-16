import prisma from "../../../prisma/prisma";

class ViewHoldsService{
    static async execute(bibid: number){
        const foundHolds = await prisma.biblioHold.findMany(
            {
                where: {
                    bibid: bibid
                }
            }
        );

        if(foundHolds.length <= 0) throw new Error('Histórico de reservas não encontrado!');

        return foundHolds;
    }
};

export default ViewHoldsService;