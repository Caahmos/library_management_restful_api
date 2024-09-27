export interface RegisterStaffRequest{
    firstName: string
    lastName: string
    username: string
    password: string
    confirmPassword?: string
    admin_flg?: boolean
    circ_flg?: boolean
    circ_mbr_flg?: boolean
    catalog_flg?: boolean
    reports_flg?: boolean
}