import prisma from "../../../prisma/prisma";

class ViewTransactionsService{
    static async execute(mbrid: number | undefined){
        const transactions = await prisma.memberAccount.findMany({
            where: {
                mbrid: mbrid || undefined
            }
        });

        if(transactions.length <= 0) throw new Error('Nenhuma transação encontrada!');

        return transactions;
    }
};

export default ViewTransactionsService;