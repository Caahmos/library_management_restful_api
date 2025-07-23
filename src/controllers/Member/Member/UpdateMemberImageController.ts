import { Request, Response } from "express";
import UpdateMemberImageService from "../../../services/Member/Member/UpdateMemberImageService";

class UpdateMemberImageController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;

    if (!userId)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não autenticado!" });
    if (!userroles.catalog_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    const mbrid = Number(req.params.mbrid);

    let image_file = null

    if (req.file) {
      image_file = req.file.filename;
    };

    if(!image_file) return res.status(422).json({ type: 'error', message: 'Nenhuma imagem enviada!'});
    if(!mbrid) throw new Error('Informe o mbrid!');

    try {
      const addedImage = await UpdateMemberImageService.execute(
        image_file, mbrid
      );
      res
        .status(201)
        .json({
          type: "success",
          message: "Imagem do membro cadastrada com sucesso!",
          addedImage,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default UpdateMemberImageController;
