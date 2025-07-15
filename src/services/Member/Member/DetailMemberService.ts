import prisma from "../../../prisma/prisma";

class DetailMemberService{
    static async execute(mbrid: number){
        const detailedMember = await prisma.member.findFirst(
            {
                where: {
                    mbrid: mbrid
                },
                include: {
                    member_fields: true
                }
            }
        );

        if(!detailedMember) throw new Error('Membro não encontrado!');

        return detailedMember;
    }
};

export default DetailMemberService;