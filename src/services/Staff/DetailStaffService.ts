import prisma from "../../prisma/prisma";

class DetailStaffService{
    static async execute(userid: number){
        const staff = await prisma.staff.findFirst(
            {
                where: {
                    userid: userid
                },
                select: {
                    first_name: true,
                    last_name: true,
                    username: true,
                    circ_flg: true,
                    circ_mbr_flg: true,
                    catalog_flg: true,
                    admin_flg: true,
                    reports_flg: true,
                    suspended_flg: true
                }
            }
        );

        if(!staff) throw new Error('Usuário não encontrado!');

        return staff;
    }
};

export default DetailStaffService;