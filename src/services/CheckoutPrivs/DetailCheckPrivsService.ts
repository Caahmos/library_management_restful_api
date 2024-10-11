import prisma from "../../prisma/prisma";

class DetailCheckPrivsService{
    static async execute(id: number){
        const checkpriv = await prisma.checkoutPrivs.findFirst(
            {
                where: {
                    id: id
                }
            }
        );

        if(!checkpriv) throw new Error('Dado não encontrado!');

        return checkpriv;
    }
};

export default DetailCheckPrivsService;