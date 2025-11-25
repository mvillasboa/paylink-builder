-- =====================================================
-- MIGRACIÓN: Tablas faltantes (clients, cards, payment_links)
-- y actualización de tablas existentes
-- =====================================================

-- 1. CREAR ENUMS NECESARIOS
CREATE TYPE payment_link_status AS ENUM ('active', 'sent', 'viewed', 'paid', 'expired', 'cancelled');
CREATE TYPE payment_link_channel AS ENUM ('whatsapp', 'sms', 'email', 'manual');
CREATE TYPE card_brand AS ENUM ('visa', 'mastercard', 'amex', 'discover', 'other');
CREATE TYPE card_status AS ENUM ('active', 'expired', 'blocked', 'removed');

-- =====================================================
-- 2. CREAR TABLA: clients (Centralizar información de clientes)
-- =====================================================
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Información básica
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  
  -- Información adicional
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Paraguay',
  tax_id TEXT, -- RUC/CI
  notes TEXT,
  
  -- Metadata
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  
  -- Estadísticas
  total_subscriptions INTEGER DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  total_spent BIGINT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT clients_user_email_unique UNIQUE (user_id, email)
);

-- Índices para clients
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_phone ON public.clients(phone_number);
CREATE INDEX idx_clients_active ON public.clients(user_id, is_active);

-- RLS para clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients"
ON public.clients FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
ON public.clients FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
ON public.clients FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger para updated_at en clients
CREATE TRIGGER set_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 3. CREAR TABLA: cards (Métodos de pago/tarjetas)
-- =====================================================
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Información de la tarjeta
  token TEXT NOT NULL, -- Token del gateway de pago
  last_four_digits TEXT NOT NULL,
  card_brand card_brand NOT NULL,
  cardholder_name TEXT NOT NULL,
  
  -- Expiración
  expiry_month TEXT NOT NULL,
  expiry_year TEXT NOT NULL,
  
  -- Estado
  status card_status DEFAULT 'active',
  is_default BOOLEAN DEFAULT false,
  
  -- Metadata
  metadata JSONB,
  
  -- Uso
  last_used_at TIMESTAMP WITH TIME ZONE,
  total_transactions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT cards_token_unique UNIQUE (token)
);

-- Índices para cards
CREATE INDEX idx_cards_user_id ON public.cards(user_id);
CREATE INDEX idx_cards_client_id ON public.cards(client_id);
CREATE INDEX idx_cards_status ON public.cards(user_id, status);
CREATE INDEX idx_cards_default ON public.cards(user_id, is_default);

-- RLS para cards
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cards"
ON public.cards FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
ON public.cards FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON public.cards FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
ON public.cards FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger para updated_at en cards
CREATE TRIGGER set_cards_updated_at
BEFORE UPDATE ON public.cards
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 4. CREAR TABLA: payment_links (Links de pago generados)
-- =====================================================
CREATE TABLE public.payment_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  
  -- Información del link
  token TEXT NOT NULL UNIQUE,
  short_code TEXT, -- Código corto para URLs amigables
  
  -- Detalles del pago
  amount BIGINT NOT NULL,
  concept TEXT NOT NULL,
  description TEXT,
  
  -- Configuración
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT 1,
  uses_count INTEGER DEFAULT 0,
  
  -- Estado y canal
  status payment_link_status DEFAULT 'active',
  channel payment_link_channel,
  
  -- Destinatario
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT NOT NULL,
  
  -- Interacciones
  sent_at TIMESTAMP WITH TIME ZONE,
  first_viewed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para payment_links
CREATE INDEX idx_payment_links_user_id ON public.payment_links(user_id);
CREATE INDEX idx_payment_links_subscription_id ON public.payment_links(subscription_id);
CREATE INDEX idx_payment_links_client_id ON public.payment_links(client_id);
CREATE INDEX idx_payment_links_token ON public.payment_links(token);
CREATE INDEX idx_payment_links_status ON public.payment_links(user_id, status);
CREATE INDEX idx_payment_links_expires_at ON public.payment_links(expires_at) WHERE status = 'active';

-- RLS para payment_links
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment links"
ON public.payment_links FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone with token can view payment link"
ON public.payment_links FOR SELECT
USING (token IS NOT NULL);

CREATE POLICY "Users can insert their own payment links"
ON public.payment_links FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment links"
ON public.payment_links FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment links"
ON public.payment_links FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger para updated_at en payment_links
CREATE TRIGGER set_payment_links_updated_at
BEFORE UPDATE ON public.payment_links
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. ACTUALIZAR TABLA: subscriptions (Agregar campos faltantes)
-- =====================================================

-- Agregar columnas de relaciones
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS original_payment_link_id UUID REFERENCES public.payment_links(id) ON DELETE SET NULL;

-- Agregar columnas de estado adicionales
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_reason TEXT,
ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS paused_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS expired_at TIMESTAMP WITH TIME ZONE;

-- Índices adicionales para subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON public.subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_card_id ON public.subscriptions(card_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_link_id ON public.subscriptions(original_payment_link_id);

-- =====================================================
-- 6. ACTUALIZAR TABLA: transactions (Agregar campos faltantes)
-- =====================================================

-- Agregar columnas de relaciones
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS payment_link_id UUID REFERENCES public.payment_links(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- Agregar columnas de detalles adicionales
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS external_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS concept TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS failure_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_amount BIGINT,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'PYG',
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Índices adicionales para transactions
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON public.transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_link_id ON public.transactions(payment_link_id);
CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON public.transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_external_id ON public.transactions(external_transaction_id);

-- =====================================================
-- 7. FUNCIÓN: Generar token único para payment links
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_payment_link_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- 8. FUNCIÓN: Expirar payment links automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION public.expire_payment_links()
RETURNS void AS $$
BEGIN
  UPDATE public.payment_links
  SET status = 'expired',
      updated_at = NOW()
  WHERE status IN ('active', 'sent', 'viewed')
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.expire_payment_links IS 'Marca como expirados los payment links que han superado su fecha de expiración';