export interface ChangeStaffPasswordRequest{
    userid: number
    password: string
    last_change_userid?: number
    confirmPassword: string
}