import prisma from "../../../prisma/prisma";

class DeleteTransactionService{
  static async execute(id: number) {
    const transactionExists = await prisma.memberAccount.findFirst({
      where: {
        id: id,
      },
    });

    if (!transactionExists) throw new Error("Nenhuma transação com esse id encontrada!");

    const deletedTransaction = await prisma.memberAccount.delete({
      where: {
        id: id,
      }
    });

    return deletedTransaction;
  }
};

export default DeleteTransactionService;
