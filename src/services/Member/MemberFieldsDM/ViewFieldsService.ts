import prisma from "../../../prisma/prisma";

class ViewFieldsService{
    static async execute(){
        const fields = await prisma.memberFieldDM.findMany();

        if(fields.length <= 0) throw new Error('Nenhum campo encontrado!');

        return fields;
    }
};

export default ViewFieldsService;