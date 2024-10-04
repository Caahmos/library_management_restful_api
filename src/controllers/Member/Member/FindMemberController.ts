import { Request, Response } from "express";
import { FindMemberRequest } from "../../../model/Member/Member/FindMemberRequest";
import FindMemberService from "../../../services/Member/Member/FindMemberService";

class FindMemberController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    if (!userroles.admin_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });
    if (!userroles.circ_mbr_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    const method = req.query.method as "name" | "barcode" | "email"; 
    const data = req.query.data as string;

    if (!data)
      return res
        .status(422)
        .json({ type: "error", message: "Preencha o campo de pesquisa." });

    const findMemberData: FindMemberRequest = {
      method: method || "name",
      data: data,
    };

    try {
      const foundMember = await FindMemberService.execute(findMemberData);
      res
        .status(200)
        .json({ type: "success", message: "Membro encontrado com sucesso!", foundMember });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default FindMemberController;
