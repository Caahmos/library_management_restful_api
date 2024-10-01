import prisma from "../../../prisma/prisma";

class ViewClassifiesService{
    static async execute(){
        const classifies = await prisma.memberClassifyDM.findMany();

        if(classifies.length <= 0) throw new Error('Nenhum usuário encontrado!');

        return classifies;
    }
};

export default ViewClassifiesService;