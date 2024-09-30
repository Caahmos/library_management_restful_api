import prisma from "../../prisma/prisma";

class DeleteStaffService{
  static async execute(userToDelete: number) {
    const staffExists = await prisma.staff.findFirst({
      where: {
        userid: userToDelete,
      },
    });

    if (!staffExists?.userid) throw new Error("Nenhum usuário com esse id encontrado!");

    const deletedStaff = await prisma.staff.delete({
      where: {
        userid: userToDelete,
      }
    });

    return deletedStaff;
  }
}

export default DeleteStaffService;
