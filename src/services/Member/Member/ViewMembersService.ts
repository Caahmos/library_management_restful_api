import prisma from "../../../prisma/prisma";

class ViewMembersService{
    static async execute(){
        const members = await prisma.member.findMany();

        if(members.length <= 0) throw new Error('Nenhum membro encontrado!');

        return members;
    }
};

export default ViewMembersService;