import prisma from "../../prisma/prisma";

class ViewStaffsService{
    static async execute(){
        const staffs = await prisma.staff.findMany(
            {
                select: {
                    userid: true,
                    firstName: true,
                    lastName: true,
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

        if(staffs.length <= 0) throw new Error('Nenhum usuário encontrado!');

        return staffs;
    }
};

export default ViewStaffsService;