import prisma from "../../../prisma/prisma";

class BasicDetailMemberService{
    static async execute(mbrid: number){
        const detailedMember = await prisma.member.findFirst(
            {
                where: {
                    mbrid: mbrid
                },
                select: {
                    first_name: true,
                    last_name: true,
                    barcode_nmbr: true,
                    imageUrl: true
                }
            }
        );

        if(!detailedMember) throw new Error('Membro não encontrado!');

        return detailedMember;
    }
};

export default BasicDetailMemberService;