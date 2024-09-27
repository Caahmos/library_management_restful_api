import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IToken {
  userid: number;
  admin_flg?: boolean;
  circ_flg?: boolean;
  circ_mbr_flg?: boolean;
  catalog_flg?: boolean;
  reports_flg?: boolean;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const verifiedToken = jwt.verify(
      token,
      process.env.SECRET as string
    ) as IToken;

    req.userid = verifiedToken.userid;
    req.userroles = {
      admin_flg: verifiedToken?.admin_flg,
      catalog_flg: verifiedToken?.catalog_flg,
      circ_flg: verifiedToken?.circ_flg,
      circ_mbr_flg: verifiedToken?.circ_mbr_flg,
      reports_flg: verifiedToken?.reports_flg,
    };

    next();
    return;
  }

  return res
    .status(422)
    .json({ type: "error", message: "Usuário não autenticado!" });
};
