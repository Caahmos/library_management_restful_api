import prisma from "../../../prisma/prisma";

class DetailFieldService{
    static async execute(code: string){
        const classify = await prisma.memberFieldDM.findFirst(
            {
                where: {
                    code: code
                }
            }
        );

        if(!classify) throw new Error('Classificação não encontrada!');

        return classify;
    }
};

export default DetailFieldService;