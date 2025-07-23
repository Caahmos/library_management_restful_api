import { Request, Response } from "express";
import { FindMemberRequest } from "../../../model/Member/Member/FindMemberRequest";
import SearchMemberService from "../../../services/Member/Member/SearchMemberService";

class SearchMemberController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    if (!userroles.circ_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    const limit = Number(req.query.limit);
    const sort = req.query.sort  as "asc" | "desc";
    const method = req.query.method as "name" | "barcode" | "email";
    const data = req.query.data as string;
    const isBlocked = Boolean(req.query.isBlocked);

    // if (!data)
    //   return res
    //     .status(422)
    //     .json({ type: "error", message: "Preencha o campo de pesquisa." });

    const searchMemberData: FindMemberRequest = {
      method: method || "name",
      data: data,
      limit: limit || 10,
      sort: sort || 'desc',
      isBlocked: isBlocked || false
    };

    try {
      const foundMember = await SearchMemberService.execute(searchMemberData);
      res
        .status(200)
        .json({
          type: "success",
          message: "Membro encontrado com sucesso!",
          foundMember,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default SearchMemberController;
