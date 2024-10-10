export interface RegisterBiblioRequest {
    title: string
    title_remainder?: string
    author: string
    responsibility_stmt?: string
    material_cd: number
    collection_cd: number
    call_nmbr1: string
    call_nmbr2?: string
    call_nmbr3?: string
    topic1?: string
    topic2?: string
    topic3?: string
    topic4?: string
    topic5?: string
    last_change_userid: number
    opac_flg: boolean
    values?: {
        [key: string]: string
    }
    indexes?: string[]
    tags?: {
        [key: string]: string
    }
    subfields?: {
        [key: string]: string
    }
    fieldIds?: {
        [key: number]: number
    }
    requiredFlgs?: {
        [key: string]: string
    }
}