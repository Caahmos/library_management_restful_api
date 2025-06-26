import { Request, Response } from "express";
import {
  BiblioFieldRequest,
  BiblioRequest,
  EditBiblioRequest,
} from "../../../model/Biblio/Biblio/EditBiblioRequest";
import EditBiblioService from "../../../services/Biblio/Biblio/EditBiblioService";

class EditBiblioController {
  static async handle(req: Request, res: Response) {
    const userId = req.userid;
    const userroles = req.userroles;
    const bibid = Number(req.params.bibid);

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

    let {
      author,
      call_nmbr1,
      collection_cd,
      last_change_userid,
      material_cd,
      opac_flg,
      title,
      call_nmbr2,
      call_nmbr3,
      title_remainder,
      topic1,
      topic2,
      topic3,
      topic4,
      topic5,
      values,
      indexes,
      tags,
      subfields,
      fieldIds,
      requiredFlgs,
      responsibility_stmt,
    }: EditBiblioRequest = req.body;

    console.log(req.body.biblio_field);

    const editBiblioData: BiblioRequest = {};
    let biblioFields: BiblioFieldRequest = {};

    if (author) editBiblioData.author = author;
    if (call_nmbr1) editBiblioData.call_nmbr1 = call_nmbr1;
    if (collection_cd) editBiblioData.collection_cd = collection_cd;
    if (material_cd) editBiblioData.material_cd = material_cd;
    if (title) editBiblioData.title = title;
    if (title_remainder) editBiblioData.title_remainder = title_remainder;
    if (call_nmbr2) editBiblioData.call_nmbr2 = call_nmbr2;
    if (call_nmbr3) editBiblioData.call_nmbr3 = call_nmbr3;
    if (responsibility_stmt) editBiblioData.responsibility_stmt = responsibility_stmt;
    if (topic1) editBiblioData.topic1 = topic1;
    if (topic2) editBiblioData.topic2 = topic2;
    if (topic3) editBiblioData.topic3 = topic3;
    if (topic4) editBiblioData.topic4 = topic4;
    if (topic5) editBiblioData.topic5 = topic5;
    if (last_change_userid) editBiblioData.last_change_userid = last_change_userid;
    if (opac_flg) editBiblioData.opac_flg = opac_flg;

    if(values && indexes && tags && fieldIds && subfields){
      biblioFields = {values, indexes, tags, fieldIds, subfields}
    }

    try {
      const editedBibliography = await EditBiblioService.execute(
        editBiblioData,
        bibid,
        biblioFields
      );
      res.status(201).json({
        type: "success",
        message: "Bibliografia atualizada com sucesso!",
        editedBibliography,
      });
    } catch (err: any) {
      res.status(422).json({ type: "error", message: err.message });
    }
  }
}

export default EditBiblioController;
