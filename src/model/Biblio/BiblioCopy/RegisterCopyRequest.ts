export interface RegisterCopyRequest {
    bibid: number
    copyid: number
    barcode_nmbr: string
    copy_desc: string
    status_cd: string
    status_begin_dt: Date
    due_back_dt: Date
    mbrid: number
    renewal_count: number
}