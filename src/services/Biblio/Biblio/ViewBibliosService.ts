import prisma from "../../../prisma/prisma";

class ViewBibliosService{
    static async execute(){
        const biblios = await prisma.biblio.findMany();

        if(biblios.length <= 0) throw new Error('Nenhuma bibliografia encontrada!');

        return biblios;
    }
};

export default ViewBibliosService;