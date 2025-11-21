import { SubscriptionType, SubscriptionFrequency, DurationType, FirstChargeType, PriceChangeType, ApplicationType } from './subscription';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  internal_code?: string;
  
  type: SubscriptionType;
  base_amount: number;
  frequency: SubscriptionFrequency;
  duration_type: DurationType;
  number_of_payments?: number;
  
  first_charge_type: FirstChargeType;
  trial_period_days: number;
  
  allow_price_modification: boolean;
  auto_apply_price_changes: boolean;
  send_reminder_before_charge: boolean;
  allow_pause: boolean;
  
  metadata?: any;
  is_active: boolean;
  
  active_subscriptions_count: number;
  total_subscriptions_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface ProductPriceChange {
  id: string;
  product_id: string;
  
  old_base_amount: number;
  new_base_amount: number;
  difference: number;
  percentage_change: number;
  
  reason: string;
  change_type: PriceChangeType;
  
  application_type: ApplicationType;
  scheduled_date?: string;
  applied_at?: string;
  
  requires_approval_for_fixed: boolean;
  auto_suspend_fixed_until_approval: boolean;
  
  status: 'pending' | 'applying' | 'applied' | 'cancelled';
  
  total_subscriptions_affected: number;
  subscriptions_applied: number;
  subscriptions_pending_approval: number;
  subscriptions_failed: number;
  
  changed_by?: string;
  internal_notes?: string;
  
  created_at: string;
  updated_at: string;
}
