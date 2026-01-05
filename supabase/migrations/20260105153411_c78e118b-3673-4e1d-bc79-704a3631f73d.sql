
-- =====================================================
-- MIGRACIÓN: Suscripciones Recuperables con Estados Separados
-- =====================================================

-- 1️⃣ ESTADO CONTRACTUAL DE LA SUSCRIPCIÓN
-- Reemplazar el enum existente con uno más simple y claro
DROP TYPE IF EXISTS subscription_contract_status CASCADE;
CREATE TYPE subscription_contract_status AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- 2️⃣ ESTADO DE COBRANZA
DROP TYPE IF EXISTS billing_status CASCADE;
CREATE TYPE billing_status AS ENUM ('IN_GOOD_STANDING', 'PAST_DUE', 'DELINQUENT', 'SUSPENDED', 'RECOVERY');

-- 3️⃣ ESTADO DEL MEDIO DE PAGO
DROP TYPE IF EXISTS payment_method_status CASCADE;
CREATE TYPE payment_method_status AS ENUM ('VALID', 'TEMPORARILY_INVALID', 'INVALID');

-- =====================================================
-- ACTUALIZAR TABLA DE TARJETAS (cards)
-- =====================================================
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS payment_method_status payment_method_status DEFAULT 'VALID',
ADD COLUMN IF NOT EXISTS invalid_reason text,
ADD COLUMN IF NOT EXISTS last_validation_date timestamptz,
ADD COLUMN IF NOT EXISTS consecutive_failures integer DEFAULT 0;

-- =====================================================
-- ACTUALIZAR TABLA DE SUSCRIPCIONES (subscriptions)
-- =====================================================

-- Agregar nuevos campos de estado separados
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS contract_status subscription_contract_status DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS billing_status billing_status DEFAULT 'IN_GOOD_STANDING',
ADD COLUMN IF NOT EXISTS billing_status_updated_at timestamptz,
ADD COLUMN IF NOT EXISTS outstanding_amount bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS outstanding_cycles integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_successful_charge_date timestamptz,
ADD COLUMN IF NOT EXISTS consecutive_failed_charges integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS recovery_started_at timestamptz,
ADD COLUMN IF NOT EXISTS recovery_attempts integer DEFAULT 0;

-- Migrar datos existentes al nuevo esquema
UPDATE public.subscriptions SET
  contract_status = CASE 
    WHEN status = 'active' THEN 'ACTIVE'::subscription_contract_status
    WHEN status = 'paused' THEN 'PAUSED'::subscription_contract_status
    WHEN status = 'cancelled' THEN 'CANCELLED'::subscription_contract_status
    WHEN status = 'expired' THEN 'CANCELLED'::subscription_contract_status
    WHEN status = 'trial' THEN 'ACTIVE'::subscription_contract_status
    ELSE 'ACTIVE'::subscription_contract_status
  END,
  billing_status = CASE
    WHEN status = 'active' THEN 'IN_GOOD_STANDING'::billing_status
    WHEN status = 'trial' THEN 'IN_GOOD_STANDING'::billing_status
    ELSE 'IN_GOOD_STANDING'::billing_status
  END,
  billing_status_updated_at = NOW()
WHERE contract_status IS NULL;

-- =====================================================
-- CREAR TABLA DE INTENTOS DE COBRO (charge_attempts)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.charge_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  card_id uuid REFERENCES public.cards(id),
  
  -- Monto y ciclo
  amount bigint NOT NULL,
  billing_cycle_date date NOT NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  
  -- Resultado
  status text NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCESS, SOFT_DECLINE, HARD_DECLINE
  status_label text, -- Etiqueta en español
  
  -- Detalles del resultado
  processor_response_code text,
  processor_response_message text,
  decline_category text, -- INSUFFICIENT_FUNDS, CARD_EXPIRED, FRAUD, DO_NOT_HONOR, etc.
  is_retryable boolean DEFAULT true,
  
  -- Transacción asociada
  transaction_id text,
  
  -- Timestamps
  attempted_at timestamptz NOT NULL DEFAULT NOW(),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  
  -- Metadatos
  metadata jsonb
);

-- Índices para charge_attempts
CREATE INDEX IF NOT EXISTS idx_charge_attempts_subscription ON public.charge_attempts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_charge_attempts_billing_cycle ON public.charge_attempts(billing_cycle_date);
CREATE INDEX IF NOT EXISTS idx_charge_attempts_status ON public.charge_attempts(status);

-- RLS para charge_attempts
ALTER TABLE public.charge_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their charge attempts"
ON public.charge_attempts FOR SELECT
USING (subscription_id IN (
  SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
));

CREATE POLICY "Users can insert charge attempts"
ON public.charge_attempts FOR INSERT
WITH CHECK (subscription_id IN (
  SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
));

-- =====================================================
-- CREAR TABLA DE HISTORIAL DE ESTADOS (subscription_status_history)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscription_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- Tipo de cambio
  status_type text NOT NULL, -- 'CONTRACT', 'BILLING', 'PAYMENT_METHOD'
  
  -- Valores
  previous_value text,
  new_value text,
  previous_label text,
  new_label text,
  
  -- Contexto
  reason text,
  triggered_by text, -- 'SYSTEM', 'USER', 'MERCHANT', 'CHARGE_RESULT'
  related_charge_attempt_id uuid REFERENCES public.charge_attempts(id),
  
  -- Timestamps
  changed_at timestamptz NOT NULL DEFAULT NOW(),
  
  -- Metadatos
  metadata jsonb
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_status_history_subscription ON public.subscription_status_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_status_history_type ON public.subscription_status_history(status_type);
CREATE INDEX IF NOT EXISTS idx_status_history_changed_at ON public.subscription_status_history(changed_at);

-- RLS
ALTER TABLE public.subscription_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their status history"
ON public.subscription_status_history FOR SELECT
USING (subscription_id IN (
  SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
));

-- =====================================================
-- CREAR TABLA DE CICLOS DE FACTURACIÓN (billing_cycles)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.billing_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- Período
  cycle_number integer NOT NULL,
  cycle_start_date date NOT NULL,
  cycle_end_date date NOT NULL,
  due_date date NOT NULL,
  
  -- Monto
  amount_due bigint NOT NULL,
  amount_paid bigint DEFAULT 0,
  
  -- Estado
  status text NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, PARTIAL, OVERDUE, WRITTEN_OFF
  status_label text,
  
  -- Intentos
  total_attempts integer DEFAULT 0,
  last_attempt_at timestamptz,
  successful_charge_id uuid REFERENCES public.charge_attempts(id),
  
  -- Timestamps
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_billing_cycles_subscription ON public.billing_cycles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_cycles_status ON public.billing_cycles(status);
CREATE INDEX IF NOT EXISTS idx_billing_cycles_due_date ON public.billing_cycles(due_date);

-- RLS
ALTER TABLE public.billing_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their billing cycles"
ON public.billing_cycles FOR SELECT
USING (subscription_id IN (
  SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
));

CREATE POLICY "Users can insert billing cycles"
ON public.billing_cycles FOR INSERT
WITH CHECK (subscription_id IN (
  SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their billing cycles"
ON public.billing_cycles FOR UPDATE
USING (subscription_id IN (
  SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
));

-- =====================================================
-- FUNCIÓN: Obtener etiqueta en español para estados
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_status_label(status_type text, status_code text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE status_type
    -- Estados contractuales
    WHEN 'CONTRACT' THEN CASE status_code
      WHEN 'ACTIVE' THEN 'Activa'
      WHEN 'PAUSED' THEN 'Pausada'
      WHEN 'CANCELLED' THEN 'Cancelada'
      ELSE status_code
    END
    -- Estados de cobranza
    WHEN 'BILLING' THEN CASE status_code
      WHEN 'IN_GOOD_STANDING' THEN 'Al día'
      WHEN 'PAST_DUE' THEN 'Con deuda'
      WHEN 'DELINQUENT' THEN 'En mora'
      WHEN 'SUSPENDED' THEN 'Cobro suspendido'
      WHEN 'RECOVERY' THEN 'En recuperación'
      ELSE status_code
    END
    -- Estados de medio de pago
    WHEN 'PAYMENT_METHOD' THEN CASE status_code
      WHEN 'VALID' THEN 'Válido'
      WHEN 'TEMPORARILY_INVALID' THEN 'Requiere actualización'
      WHEN 'INVALID' THEN 'No válido'
      ELSE status_code
    END
    -- Estados de intento de cobro
    WHEN 'CHARGE' THEN CASE status_code
      WHEN 'PENDING' THEN 'Pendiente'
      WHEN 'SUCCESS' THEN 'Exitoso'
      WHEN 'SOFT_DECLINE' THEN 'Rechazado temporalmente'
      WHEN 'HARD_DECLINE' THEN 'Rechazado permanentemente'
      ELSE status_code
    END
    -- Estados de ciclo de facturación
    WHEN 'CYCLE' THEN CASE status_code
      WHEN 'PENDING' THEN 'Pendiente'
      WHEN 'PAID' THEN 'Pagado'
      WHEN 'PARTIAL' THEN 'Pago parcial'
      WHEN 'OVERDUE' THEN 'Vencido'
      WHEN 'WRITTEN_OFF' THEN 'Dado de baja'
      ELSE status_code
    END
    ELSE status_code
  END;
END;
$$;

-- =====================================================
-- FUNCIÓN: Registrar cambio de estado en historial
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Registrar cambio de estado contractual
  IF OLD.contract_status IS DISTINCT FROM NEW.contract_status THEN
    INSERT INTO public.subscription_status_history (
      subscription_id, status_type, previous_value, new_value,
      previous_label, new_label, triggered_by
    ) VALUES (
      NEW.id, 'CONTRACT', OLD.contract_status::text, NEW.contract_status::text,
      get_status_label('CONTRACT', OLD.contract_status::text),
      get_status_label('CONTRACT', NEW.contract_status::text),
      'SYSTEM'
    );
  END IF;
  
  -- Registrar cambio de estado de cobranza
  IF OLD.billing_status IS DISTINCT FROM NEW.billing_status THEN
    INSERT INTO public.subscription_status_history (
      subscription_id, status_type, previous_value, new_value,
      previous_label, new_label, triggered_by
    ) VALUES (
      NEW.id, 'BILLING', OLD.billing_status::text, NEW.billing_status::text,
      get_status_label('BILLING', OLD.billing_status::text),
      get_status_label('BILLING', NEW.billing_status::text),
      'SYSTEM'
    );
    NEW.billing_status_updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Crear trigger para logging automático
DROP TRIGGER IF EXISTS subscription_status_change_trigger ON public.subscriptions;
CREATE TRIGGER subscription_status_change_trigger
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.log_status_change();

-- =====================================================
-- FUNCIÓN: Registrar cambio de estado de medio de pago
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_card_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub_id uuid;
BEGIN
  IF OLD.payment_method_status IS DISTINCT FROM NEW.payment_method_status THEN
    -- Buscar suscripción asociada a esta tarjeta
    SELECT id INTO sub_id FROM public.subscriptions WHERE card_id = NEW.id LIMIT 1;
    
    IF sub_id IS NOT NULL THEN
      INSERT INTO public.subscription_status_history (
        subscription_id, status_type, previous_value, new_value,
        previous_label, new_label, triggered_by
      ) VALUES (
        sub_id, 'PAYMENT_METHOD', OLD.payment_method_status::text, NEW.payment_method_status::text,
        get_status_label('PAYMENT_METHOD', OLD.payment_method_status::text),
        get_status_label('PAYMENT_METHOD', NEW.payment_method_status::text),
        'SYSTEM'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS card_status_change_trigger ON public.cards;
CREATE TRIGGER card_status_change_trigger
BEFORE UPDATE ON public.cards
FOR EACH ROW
EXECUTE FUNCTION public.log_card_status_change();

-- =====================================================
-- Actualizar trigger de updated_at para nuevas tablas
-- =====================================================
CREATE TRIGGER update_billing_cycles_updated_at
BEFORE UPDATE ON public.billing_cycles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
