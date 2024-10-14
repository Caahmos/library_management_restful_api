import { RegisterCopyRequest } from "../../../model/Biblio/BiblioCopy/RegisterCopyRequest";
import prisma from "../../../prisma/prisma";

class RegisterCopyService {
  static async execute(copyData: RegisterCopyRequest) {
    copyData.copyid = 1;   

    const biblioCopyExists = await prisma.biblioCopy.findMany({ where: {
        bibid: copyData.bibid
    }});

    if(biblioCopyExists && biblioCopyExists.length > 0){
        const lastCopyId = biblioCopyExists.reduce((prevCopy, currentCopy) => {
            return (prevCopy.copyid > currentCopy.copyid) ? prevCopy : currentCopy;
        });

        copyData.copyid = lastCopyId.copyid + 1;
    };

    const bibidExists = await prisma.biblio.findFirst({ where: {
      bibid: copyData.bibid
    }});

    if(!bibidExists) throw new Error('Nenhuma bibliografia com esse bibid encontrada!');

    const copyExists = await prisma.biblioCopy.findFirst({
      where: {
        copy_desc: copyData.copy_desc,
      },
    });

    if (copyExists)
      throw new Error("Já existe uma cópia com esse código!");

    const registeredCopy = await prisma.biblioCopy.create({
      data: copyData
    });

    return registeredCopy;
  };
};

export default RegisterCopyService;
