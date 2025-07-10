import { Request, Response } from "express";
import ViewMembersService from "../../../services/Member/Member/ViewMembersService";
import { ViewMembers, ViewMembersRequest, ViewMembersSearch } from "../../../model/Member/Member/ViewMembersRequest";

class ViewMembersController{
    static async handle(req: Request, res: Response){
        const userId = req.userid;
        const userroles = req.userroles;
            
        if(!userId) return res.status(422).json({ type: 'error', message: 'Usuário não autenticado!'});
        if(!userroles.admin_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});
        if(!userroles.circ_mbr_flg) return res.status(422).json({ type: 'error', message: 'Usuário não tem permissão!'});

        const { limit, sort }: ViewMembers =
              req.query;

        const memberFilters: ViewMembersSearch = {};

        if (limit) memberFilters.limit = Number(limit);
        if (sort) memberFilters.sort = sort;

        try{
            const members = await ViewMembersService.execute(memberFilters);
            res.status(201).json({ type: 'success', message: 'Membros encontrados com sucesso!', members });
        }catch(err: any){
            res.status(422).json({ type: 'error', message: err.message});
        };
    };
};

export default ViewMembersController;