// =====================================================
// TIPOS PARA SUSCRIPCIONES RECUPERABLES
// Separación de capas: Contractual, Cobranza, Medio de Pago
// =====================================================

// =====================================================
// 1️⃣ ESTADO CONTRACTUAL (¿El acuerdo sigue vigente?)
// =====================================================
export type ContractStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';

export const ContractStatusLabels: Record<ContractStatus, string> = {
  ACTIVE: 'Activa',
  PAUSED: 'Pausada',
  CANCELLED: 'Cancelada',
};

// =====================================================
// 2️⃣ ESTADO DE COBRANZA (¿Cómo está el pago hoy?)
// =====================================================
export type BillingStatus = 'IN_GOOD_STANDING' | 'PAST_DUE' | 'DELINQUENT' | 'SUSPENDED' | 'RECOVERY';

export const BillingStatusLabels: Record<BillingStatus, string> = {
  IN_GOOD_STANDING: 'Al día',
  PAST_DUE: 'Con deuda',
  DELINQUENT: 'En mora',
  SUSPENDED: 'Cobro suspendido',
  RECOVERY: 'En recuperación',
};

// =====================================================
// 3️⃣ ESTADO DEL MEDIO DE PAGO (¿Puede usarse para cobrar?)
// =====================================================
export type PaymentMethodStatus = 'VALID' | 'TEMPORARILY_INVALID' | 'INVALID';

export const PaymentMethodStatusLabels: Record<PaymentMethodStatus, string> = {
  VALID: 'Válido',
  TEMPORARILY_INVALID: 'Requiere actualización',
  INVALID: 'No válido',
};

// =====================================================
// ESTADO DE INTENTO DE COBRO
// =====================================================
export type ChargeAttemptStatus = 'PENDING' | 'SUCCESS' | 'SOFT_DECLINE' | 'HARD_DECLINE';

export const ChargeAttemptStatusLabels: Record<ChargeAttemptStatus, string> = {
  PENDING: 'Pendiente',
  SUCCESS: 'Exitoso',
  SOFT_DECLINE: 'Rechazado temporalmente',
  HARD_DECLINE: 'Rechazado permanentemente',
};

// Categorías de rechazo
export type DeclineCategory = 
  | 'INSUFFICIENT_FUNDS'
  | 'CARD_EXPIRED'
  | 'FRAUD'
  | 'DO_NOT_HONOR'
  | 'INVALID_CARD'
  | 'LOST_STOLEN'
  | 'RESTRICTED_CARD'
  | 'PROCESSING_ERROR'
  | 'UNKNOWN';

export const DeclineCategoryLabels: Record<DeclineCategory, string> = {
  INSUFFICIENT_FUNDS: 'Fondos insuficientes',
  CARD_EXPIRED: 'Tarjeta expirada',
  FRAUD: 'Sospecha de fraude',
  DO_NOT_HONOR: 'No honrar',
  INVALID_CARD: 'Tarjeta inválida',
  LOST_STOLEN: 'Tarjeta perdida/robada',
  RESTRICTED_CARD: 'Tarjeta restringida',
  PROCESSING_ERROR: 'Error de procesamiento',
  UNKNOWN: 'Desconocido',
};

// =====================================================
// ESTADO DE CICLO DE FACTURACIÓN
// =====================================================
export type BillingCycleStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'WRITTEN_OFF';

export const BillingCycleStatusLabels: Record<BillingCycleStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PARTIAL: 'Pago parcial',
  OVERDUE: 'Vencido',
  WRITTEN_OFF: 'Dado de baja',
};

// =====================================================
// TIPOS LEGACY (para compatibilidad)
// =====================================================
export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual' | 'yearly';
export type SubscriptionType = 'fixed' | 'variable' | 'single';
export type DurationType = 'unlimited' | 'limited';
export type FirstChargeType = 'immediate' | 'scheduled';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired' | 'trial';
export type PriceChangeType = 'upgrade' | 'downgrade' | 'inflation' | 'custom';
export type ApplicationType = 'immediate' | 'next_cycle' | 'scheduled';
export type ClientApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not_required';

// =====================================================
// INTERFACES PRINCIPALES
// =====================================================

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
  
  // =====================================================
  // NUEVOS ESTADOS SEPARADOS
  // =====================================================
  
  // Estado contractual (NO cambia por rechazos de cobro)
  contract_status: ContractStatus;
  
  // Estado de cobranza (refleja situación de pago actual)
  billing_status: BillingStatus;
  billing_status_updated_at?: string;
  
  // Métricas de deuda
  outstanding_amount: number;
  outstanding_cycles: number;
  
  // Métricas de cobro
  last_successful_charge_date?: string;
  consecutive_failed_charges: number;
  
  // Recuperación
  recovery_started_at?: string;
  recovery_attempts: number;
  
  // =====================================================
  // ESTADO LEGACY (para compatibilidad temporal)
  // =====================================================
  status: SubscriptionStatus;
  next_charge_date: string;
  last_charge_date?: string;
  
  // Tracking de cambios de precio
  last_price_change_date?: string;
  price_change_history_count: number;
  pending_price_change_id?: string;
  
  // Relaciones
  card_id?: string;
  product_id?: string;
  client_id?: string;
  
  // Metadatos
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancelled_reason?: string;
  paused_at?: string;
  paused_until?: string;
  expired_at?: string;
}

// =====================================================
// INTENTO DE COBRO
// =====================================================
export interface ChargeAttempt {
  id: string;
  subscription_id: string;
  card_id?: string;
  
  // Monto y ciclo
  amount: number;
  billing_cycle_date: string;
  attempt_number: number;
  
  // Resultado
  status: ChargeAttemptStatus;
  status_label?: string;
  
  // Detalles del resultado
  processor_response_code?: string;
  processor_response_message?: string;
  decline_category?: DeclineCategory;
  is_retryable: boolean;
  
  // Transacción asociada
  transaction_id?: string;
  
  // Timestamps
  attempted_at: string;
  created_at: string;
  
  // Metadatos
  metadata?: Record<string, unknown>;
}

// =====================================================
// CICLO DE FACTURACIÓN
// =====================================================
export interface BillingCycle {
  id: string;
  subscription_id: string;
  
  // Período
  cycle_number: number;
  cycle_start_date: string;
  cycle_end_date: string;
  due_date: string;
  
  // Monto
  amount_due: number;
  amount_paid: number;
  
  // Estado
  status: BillingCycleStatus;
  status_label?: string;
  
  // Intentos
  total_attempts: number;
  last_attempt_at?: string;
  successful_charge_id?: string;
  
  // Timestamps
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// HISTORIAL DE ESTADOS
// =====================================================
export type StatusChangeType = 'CONTRACT' | 'BILLING' | 'PAYMENT_METHOD';
export type StatusChangeTrigger = 'SYSTEM' | 'USER' | 'MERCHANT' | 'CHARGE_RESULT';

export interface SubscriptionStatusHistory {
  id: string;
  subscription_id: string;
  
  // Tipo de cambio
  status_type: StatusChangeType;
  
  // Valores
  previous_value?: string;
  new_value: string;
  previous_label?: string;
  new_label: string;
  
  // Contexto
  reason?: string;
  triggered_by: StatusChangeTrigger;
  related_charge_attempt_id?: string;
  
  // Timestamps
  changed_at: string;
  
  // Metadatos
  metadata?: Record<string, unknown>;
}

// =====================================================
// CAMBIO DE PRECIO DE SUSCRIPCIÓN
// =====================================================
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

// =====================================================
// LOG DE NOTIFICACIONES
// =====================================================
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

// =====================================================
// HELPERS PARA UI
// =====================================================

export interface SubscriptionStatusSummary {
  contract: {
    code: ContractStatus;
    label: string;
  };
  billing: {
    code: BillingStatus;
    label: string;
  };
  paymentMethod: {
    code: PaymentMethodStatus;
    label: string;
  };
  lastAttempt?: {
    status: ChargeAttemptStatus;
    label: string;
    reason?: string;
  };
  suggestedAction?: string;
}

export function getSubscriptionStatusSummary(
  subscription: Subscription,
  card?: { payment_method_status: PaymentMethodStatus },
  lastAttempt?: ChargeAttempt
): SubscriptionStatusSummary {
  const paymentMethodStatus = card?.payment_method_status || 'VALID';
  
  let suggestedAction: string | undefined;
  
  // Determinar acción sugerida basada en estados
  if (subscription.contract_status === 'ACTIVE') {
    if (subscription.billing_status === 'PAST_DUE' || subscription.billing_status === 'DELINQUENT') {
      if (paymentMethodStatus === 'INVALID' || paymentMethodStatus === 'TEMPORARILY_INVALID') {
        suggestedAction = 'Solicitar actualización de medio de pago';
      } else {
        suggestedAction = 'Programar reintento de cobro';
      }
    } else if (subscription.billing_status === 'RECOVERY') {
      suggestedAction = 'En proceso de recuperación automática';
    } else if (subscription.billing_status === 'SUSPENDED') {
      suggestedAction = 'Contactar al cliente para resolver';
    }
  }
  
  return {
    contract: {
      code: subscription.contract_status,
      label: ContractStatusLabels[subscription.contract_status],
    },
    billing: {
      code: subscription.billing_status,
      label: BillingStatusLabels[subscription.billing_status],
    },
    paymentMethod: {
      code: paymentMethodStatus,
      label: PaymentMethodStatusLabels[paymentMethodStatus],
    },
    lastAttempt: lastAttempt ? {
      status: lastAttempt.status,
      label: ChargeAttemptStatusLabels[lastAttempt.status],
      reason: lastAttempt.processor_response_message,
    } : undefined,
    suggestedAction,
  };
}
