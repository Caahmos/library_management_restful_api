export interface EditCheckPrivRequest {
  checkout_limit: number;
  days_due_back: number;
  renewal_limit: number;
  grace_period_days: number;
}
