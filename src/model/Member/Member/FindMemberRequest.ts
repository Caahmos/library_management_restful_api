export interface FindMemberRequest{
    data: string
    method: 'barcode' | 'name' | 'email'
    limit?: number;
    sort?: 'asc' | 'desc'
}