import { Request, Response } from "express";
import { EditMember, EditMemberRequest, MemberFields } from "../../../model/Member/Member/EditMemberRequest";
import EditMemberService from "../../../services/Member/Member/EditMemberService";

class EditMemberController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;
    const mbrid = Number(req.params.mbrid);

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    if (!userroles.circ_mbr_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    let {
      first_name,
      last_name,
      barcode_nmbr,
      address,
      home_phone,
      work_phone,
      email,
      last_change_userid,
      code,
      data,
      classification,
    }: EditMemberRequest = req.body;

    const editMemberData: EditMember = {};
    const memberFields: MemberFields = {};

    if (code && data && code.length === data.length) {
      memberFields.code = code;
      memberFields.data = data;
    }

    last_change_userid = userId;

    if (first_name) editMemberData.first_name = first_name;
    if (last_name) editMemberData.last_name = last_name;
    if (barcode_nmbr) editMemberData.barcode_nmbr = barcode_nmbr;
    if (address) editMemberData.address = address;
    if (home_phone) editMemberData.home_phone = home_phone;
    if (work_phone) editMemberData.work_phone = work_phone;
    if (email) editMemberData.email = email;
    if (classification) editMemberData.classification = Number(classification);

    try {
      const editedMember = await EditMemberService.execute(
        editMemberData,
        mbrid,
        memberFields
      );
      res
        .status(201)
        .json({
          type: "success",
          message: "Membro atualizado com sucesso!",
          editedMember,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default EditMemberController;
