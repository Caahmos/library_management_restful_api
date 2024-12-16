import { Request, Response } from "express";
import UpdateImageService from "../../../services/Biblio/Biblio/UpdateImageService";

class UpdateImageController {
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
    if (!userroles.catalog_flg)
      return res
        .status(422)
        .json({ type: "error", message: "Usuário não tem permissão!" });

    const bibid = Number(req.params.bibid);

    let image_file = null

    if (req.file) {
      image_file = req.file.filename;
    };

    if(!image_file) return res.status(422).json({ type: 'error', message: 'Nenhuma imagem enviada!'});
    if(!bibid) throw new Error('Informe o bibid!');

    try {
      const addedImage = await UpdateImageService.execute(
        image_file, bibid
      );
      res
        .status(201)
        .json({
          type: "success",
          message: "Imagem da bibliografia cadastrada com sucesso!",
          addedImage,
        });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default UpdateImageController;
