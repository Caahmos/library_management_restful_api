import { RegisterCopyRequest } from "../../../model/Biblio/BiblioCopy/RegisterCopyRequest";
import prisma from "../../../prisma/prisma";

class RegisterCopyService {
  static async execute(copyData: RegisterCopyRequest) {
    copyData.copyid = 1;   

    const biblioExists = await prisma.biblioCopy.findMany({ where: {
        bibid: copyData.bibid
    }})

    if(biblioExists && biblioExists.length > 0){
        const lastCopyId = biblioExists.reduce((prevCopy, currentCopy) => {
            return (prevCopy.copyid > currentCopy.copyid) ? prevCopy : currentCopy;
        });

        copyData.copyid = lastCopyId.copyid;
    }

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
  }
}

export default RegisterCopyService;
