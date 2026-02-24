export interface RegisterCollectionRequest {
    description: string
    daily_late_fee: number
    color1?: string
    color2?: string
    colors?: string | null
}