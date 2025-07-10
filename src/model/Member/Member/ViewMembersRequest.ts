export interface ViewMembersRequest {
    first_name: string
    last_name: string
    barcode_nmbr: string
    address: string
    home_phone: string
    work_phone: string
    email: string
    last_change_userid: number
    classification: number
}

export interface ViewMembers {
    limit?: string;
    sort?: 'asc' | 'desc';
}
export interface ViewMembersSearch {
    limit?: number;
    sort?: 'asc' | 'desc';
}

