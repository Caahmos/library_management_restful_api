export interface FindMemberRequest{
    data: string
    method: 'barcode' | 'name' | 'email'
}