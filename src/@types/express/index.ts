declare namespace Express {
  export interface Request {
    userid: number;
    userroles: {
      admin_flg?: boolean;
      circ_flg?: boolean;
      circ_mbr_flg?: boolean;
      catalog_flg?: boolean;
      reports_flg?: boolean;
    };
  }
}
