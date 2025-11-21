-- =====================================================
-- SISTEMA DE SUSCRIPCIONES CON MODIFICACIÓN DE MONTOS
-- =====================================================

-- 1. Crear tipo enum para frecuencia
CREATE TYPE public.subscription_frequency AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');

-- 2. Crear tipo enum para tipo de suscripción
CREATE TYPE public.subscription_type AS ENUM ('fixed', 'variable', 'single');

-- 3. Crear tipo enum para tipo de duración
CREATE TYPE public.duration_type AS ENUM ('unlimited', 'limited');

-- 4. Crear tipo enum para tipo de primer cobro
CREATE TYPE public.first_charge_type AS ENUM ('immediate', 'scheduled');

-- 5. Crear tipo enum para estado de suscripción
CREATE TYPE public.subscription_status AS ENUM ('active', 'paused', 'cancelled', 'expired', 'trial');

-- 6. Crear tipo enum para tipo de cambio de precio
CREATE TYPE public.price_change_type AS ENUM ('upgrade', 'downgrade', 'inflation', 'custom');

-- 7. Crear tipo enum para tipo de aplicación
CREATE TYPE public.application_type AS ENUM ('immediate', 'next_cycle', 'scheduled');

-- 8. Crear tipo enum para estado de aprobación del cliente
CREATE TYPE public.client_approval_status AS ENUM ('pending', 'approved', 'rejected', 'not_required');

-- 9. Crear tabla de suscripciones
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Campos obligatorios
  reference TEXT NOT NULL UNIQUE,
  billing_day INTEGER NOT NULL CHECK (billing_day >= 1 AND billing_day <= 28),
  phone_number TEXT NOT NULL CHECK (phone_number ~ '^\+595\d{9}$'),
  
  -- Información básica
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  type subscription_type NOT NULL DEFAULT 'fixed',
  
  -- Configuración de cobro
  amount BIGINT NOT NULL CHECK (amount > 0),
  first_payment_amount BIGINT CHECK (first_payment_amount > 0),
  first_payment_reason TEXT,
  frequency subscription_frequency NOT NULL,
  concept TEXT NOT NULL,
  description TEXT,
  
  -- Duración
  duration_type duration_type NOT NULL,
  number_of_payments INTEGER CHECK (number_of_payments >= 1),
  payments_completed INTEGER DEFAULT 0,
  
  -- Primer cobro
  first_charge_type first_charge_type NOT NULL,
  first_charge_date TIMESTAMPTZ,
  is_first_payment_completed BOOLEAN DEFAULT FALSE,
  
  -- Configuraciones
  trial_period_days INTEGER DEFAULT 0 CHECK (trial_period_days >= 0),
  send_reminder_before_charge BOOLEAN DEFAULT TRUE,
  allow_pause BOOLEAN DEFAULT FALSE,
  
  -- Estado
  status subscription_status NOT NULL DEFAULT 'active',
  next_charge_date TIMESTAMPTZ NOT NULL,
  last_charge_date TIMESTAMPTZ,
  
  -- Tracking de cambios de precio
  last_price_change_date TIMESTAMPTZ,
  price_change_history_count INTEGER DEFAULT 0,
  pending_price_change_id UUID,
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraint: si existe first_payment_amount, debe ser diferente a amount
  CONSTRAINT check_first_payment_different CHECK (
    first_payment_amount IS NULL OR 
    first_payment_amount <> amount
  )
);

-- 10. Crear tabla de cambios de precio
CREATE TABLE public.subscription_price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  
  -- Montos
  old_amount BIGINT NOT NULL,
  new_amount BIGINT NOT NULL,
  difference BIGINT GENERATED ALWAYS AS (new_amount - old_amount) STORED,
  percentage_change NUMERIC(5, 2) GENERATED ALWAYS AS 
    (((new_amount - old_amount)::NUMERIC / old_amount::NUMERIC) * 100) STORED,
  
  -- Detalles del cambio
  reason TEXT NOT NULL,
  change_type price_change_type NOT NULL,
  
  -- Cuándo aplica
  application_type application_type NOT NULL,
  scheduled_date TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  
  -- Aprobación del cliente
  requires_client_approval BOOLEAN DEFAULT FALSE,
  client_approval_status client_approval_status DEFAULT 'not_required',
  client_approval_date TIMESTAMPTZ,
  client_approval_method TEXT,
  approval_token TEXT UNIQUE,
  
  -- Quien hizo el cambio
  changed_by UUID REFERENCES auth.users(id),
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'applied', 'cancelled')),
  
  -- Notificaciones
  client_notified BOOLEAN DEFAULT FALSE,
  client_notified_at TIMESTAMPTZ,
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Notas internas
  internal_notes TEXT
);

-- 11. Crear tabla de logs de notificaciones
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'whatsapp', 'email')),
  event TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Costos (opcional para tracking)
  cost_amount NUMERIC(10, 4),
  currency TEXT DEFAULT 'PYG'
);

-- 12. Crear índices para subscriptions
CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX subscriptions_next_charge_date_idx ON public.subscriptions(next_charge_date);
CREATE INDEX subscriptions_phone_number_idx ON public.subscriptions(phone_number);
CREATE INDEX subscriptions_pending_price_change_idx ON public.subscriptions(pending_price_change_id)
  WHERE pending_price_change_id IS NOT NULL;

-- 13. Crear índices para subscription_price_changes
CREATE INDEX subscription_price_changes_subscription_id_idx 
  ON public.subscription_price_changes(subscription_id);
CREATE INDEX subscription_price_changes_status_idx 
  ON public.subscription_price_changes(status);
CREATE INDEX subscription_price_changes_scheduled_date_idx 
  ON public.subscription_price_changes(scheduled_date)
  WHERE status = 'scheduled';
CREATE INDEX subscription_price_changes_approval_token_idx
  ON public.subscription_price_changes(approval_token)
  WHERE approval_token IS NOT NULL;

-- 14. Crear índices para notification_logs
CREATE INDEX notification_logs_subscription_id_idx ON public.notification_logs(subscription_id);
CREATE INDEX notification_logs_sent_at_idx ON public.notification_logs(sent_at);

-- 15. Habilitar RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_price_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- 16. Políticas RLS para subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 17. Políticas RLS para subscription_price_changes
CREATE POLICY "Users can view their subscription price changes"
  ON public.subscription_price_changes FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their subscription price changes"
  ON public.subscription_price_changes FOR INSERT
  TO authenticated
  WITH CHECK (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their subscription price changes"
  ON public.subscription_price_changes FOR UPDATE
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

-- Política especial para aprobación pública por token
CREATE POLICY "Anyone with token can view price change for approval"
  ON public.subscription_price_changes FOR SELECT
  TO anon, authenticated
  USING (approval_token IS NOT NULL);

-- 18. Políticas RLS para notification_logs
CREATE POLICY "Users can view their notification logs"
  ON public.notification_logs FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    )
  );

-- 19. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 20. Triggers para updated_at
CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_price_changes
  BEFORE UPDATE ON public.subscription_price_changes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 21. Función para generar token de aprobación
CREATE OR REPLACE FUNCTION public.generate_approval_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;