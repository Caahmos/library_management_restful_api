export interface EditCollectionRequest {
    description?: string
    days_due_back?: number
    daily_late_fee?: number
    colors?: string | null
    color1?: string
    color2?: string
}