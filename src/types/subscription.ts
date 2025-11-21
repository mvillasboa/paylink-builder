export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual' | 'yearly';
export type SubscriptionType = 'fixed' | 'variable' | 'single';
export type DurationType = 'unlimited' | 'limited';
export type FirstChargeType = 'immediate' | 'scheduled';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired' | 'trial';
export type PriceChangeType = 'upgrade' | 'downgrade' | 'inflation' | 'custom';
export type ApplicationType = 'immediate' | 'next_cycle' | 'scheduled';
export type ClientApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not_required';

export interface Subscription {
  id: string;
  user_id: string;
  
  // Campos obligatorios
  reference: string;
  billing_day: number;
  phone_number: string;
  
  // Información básica
  client_name: string;
  client_email: string;
  type: SubscriptionType;
  
  // Configuración de cobro
  amount: number;
  first_payment_amount?: number;
  first_payment_reason?: string;
  frequency: SubscriptionFrequency;
  concept: string;
  description?: string;
  
  // Duración
  duration_type: DurationType;
  number_of_payments?: number;
  payments_completed: number;
  
  // Primer cobro
  first_charge_type: FirstChargeType;
  first_charge_date?: string;
  is_first_payment_completed: boolean;
  
  // Configuraciones
  trial_period_days: number;
  send_reminder_before_charge: boolean;
  allow_pause: boolean;
  
  // Estado
  status: SubscriptionStatus;
  next_charge_date: string;
  last_charge_date?: string;
  
  // Tracking de cambios de precio
  last_price_change_date?: string;
  price_change_history_count: number;
  pending_price_change_id?: string;
  
  // Metadatos
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPriceChange {
  id: string;
  subscription_id: string;
  
  // Montos
  old_amount: number;
  new_amount: number;
  difference: number;
  percentage_change: number;
  
  // Detalles
  reason: string;
  change_type: PriceChangeType;
  
  // Aplicación
  application_type: ApplicationType;
  scheduled_date?: string;
  applied_at?: string;
  
  // Aprobación
  requires_client_approval: boolean;
  client_approval_status: ClientApprovalStatus;
  client_approval_date?: string;
  client_approval_method?: string;
  approval_token?: string;
  
  // Quien hizo el cambio
  changed_by?: string;
  
  // Estado
  status: 'pending' | 'scheduled' | 'applied' | 'cancelled';
  
  // Notificaciones
  client_notified: boolean;
  client_notified_at?: string;
  
  // Metadatos
  created_at: string;
  updated_at: string;
  internal_notes?: string;
}

export interface NotificationLog {
  id: string;
  subscription_id: string;
  phone_number: string;
  channel: 'sms' | 'whatsapp' | 'email';
  event: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
  sent_at: string;
  cost_amount?: number;
  currency: string;
}
