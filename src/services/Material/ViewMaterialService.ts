import prisma from "../../prisma/prisma";

class ViewMaterialsService{
    static async execute(){
        const materials = await prisma.materialTypeDM.findMany();

        if(materials.length <= 0) throw new Error('Nenhum usuário encontrado!');

        return materials;
    }
};

export default ViewMaterialsService;