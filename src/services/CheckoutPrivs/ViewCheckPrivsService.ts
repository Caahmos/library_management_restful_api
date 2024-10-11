import prisma from "../../prisma/prisma";

class ViewCheckPrivsService{
    static async execute(){
        const checkprivs = await prisma.checkoutPrivs.findMany();

        if(checkprivs.length <= 0) throw new Error('Nenhum dado encontrado!');

        return checkprivs;
    }
};

export default ViewCheckPrivsService;