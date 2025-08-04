export interface RegisterCollectionRequest {
    description: string
    days_due_back: number
    daily_late_fee: number
    color1?: string
    color2?: string
    colors?: string | null
}