import prisma from "../../../prisma/prisma";

class DetailClassifyService{
    static async execute(code: number){
        const classify = await prisma.memberClassifyDM.findFirst(
            {
                where: {
                    code: code
                }
            }
        );

        if(!classify) throw new Error('Campo não encontrado!');

        return classify;
    }
};

export default DetailClassifyService;