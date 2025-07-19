import prisma from "../../../prisma/prisma";

class BlockMemberService{
    static async execute(mbrid: number){
        const memberExists = await prisma.member.findFirst(
            {
                where: {
                    mbrid: mbrid
                },
                include: {
                    member_fields: true
                }
            }
        );

        if(!memberExists) throw new Error('Membro não encontrado!');

        const verifyCheckOut = await prisma.biblioCopy.findFirst({
            where: {
                mbrid: memberExists.mbrid,
                status_cd: 'out'
            }
        });

        if(verifyCheckOut) throw new Error('Realize a devolução do livro primeiro!');

        const changeMemberBlock = await prisma.member.update({
            where: {
                mbrid: memberExists.mbrid
            },
            data: {
                isBlocked: !memberExists.isBlocked
            }
        })

        console.log(!memberExists.isBlocked)

        return changeMemberBlock;
    }
};

export default BlockMemberService;