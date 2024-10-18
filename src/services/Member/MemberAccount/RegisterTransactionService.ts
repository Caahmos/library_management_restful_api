import { RegisterAccountRequest } from "../../../model/Member/MemberAccount/RegisterAccountRequest";
import prisma from "../../../prisma/prisma";

class RegisterTransactionService {
  static async execute(transactionData: RegisterAccountRequest) {
    transactionData.transid = 1;

    const mbridExists = await prisma.member.findFirst({
      where: {
        mbrid: transactionData.mbrid,
      },
    });

    if (!mbridExists)
      throw new Error("Nenhum membro com esse mbrid encontrado!");

    const accountExistis = await prisma.memberAccount.findMany({
      where: {
        mbrid: transactionData.mbrid,
      },
    });

    if (accountExistis && accountExistis.length > 0) {
      const lastTransid = accountExistis.reduce((prevCopy, currentCopy) => {
        return prevCopy.transid > currentCopy.transid ? prevCopy : currentCopy;
      });

      transactionData.transid = lastTransid.transid + 1;
    }

    const transactionExists = await prisma.transactionTypeDM.findFirst({
      where: {
        description: transactionData.transaction_type,
      },
    });

    if (!transactionExists)
      throw new Error("Não existe nenhum tipo de transação com esse código!");

    transactionData.transaction_type = transactionExists.code;

    if(transactionData.transaction_type === '-r' || transactionData.transaction_type === '-p'){
      transactionData.amount = -transactionData.amount;
    };

    const registeredTransaction = await prisma.memberAccount.create({
      data: transactionData,
    });

    return registeredTransaction;
  }
}

export default RegisterTransactionService;
