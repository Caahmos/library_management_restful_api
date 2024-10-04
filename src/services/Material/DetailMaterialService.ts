import prisma from "../../prisma/prisma";

class DetailMaterialService{
    static async execute(code: number){
        const material = await prisma.materialTypeDM.findFirst(
            {
                where: {
                    code: code
                }
            }
        );

        if(!material) throw new Error('Material não encontrado!');

        return material;
    }
};

export default DetailMaterialService;