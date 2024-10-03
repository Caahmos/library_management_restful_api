import prisma from "../../../prisma/prisma";

class DetailMemberService{
    static async execute(mbrid: number){
        const detailedMember = await prisma.member.findFirst(
            {
                where: {
                    mbrid: mbrid
                }
            }
        );

        if(!detailedMember) throw new Error('Classificação não encontrada!');

        return detailedMember;
    }
};

export default DetailMemberService;