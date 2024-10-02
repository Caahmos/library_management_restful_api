export interface RegisterMemberRequest {
    first_name: string
    last_name: string
    barcode_nmbr: string
    address?: string
    home_phone?: string
    work_phone?: string
    email: string
    last_change_userid: number
    code?: string[]
    data?: string[]
    classification: number
}