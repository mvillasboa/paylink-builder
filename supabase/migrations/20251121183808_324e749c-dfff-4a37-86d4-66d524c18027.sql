-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information
  name TEXT NOT NULL,
  description TEXT,
  internal_code TEXT,
  
  -- Subscription configuration (template)
  type subscription_type NOT NULL,
  base_amount BIGINT NOT NULL,
  frequency subscription_frequency NOT NULL,
  duration_type duration_type NOT NULL,
  number_of_payments INTEGER,
  
  -- First charge configuration
  first_charge_type first_charge_type DEFAULT 'immediate',
  trial_period_days INTEGER DEFAULT 0,
  
  -- Product options
  allow_price_modification BOOLEAN DEFAULT true,
  auto_apply_price_changes BOOLEAN DEFAULT false,
  send_reminder_before_charge BOOLEAN DEFAULT true,
  allow_pause BOOLEAN DEFAULT false,
  
  -- Metadata
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  
  -- Statistics
  active_subscriptions_count INTEGER DEFAULT 0,
  total_subscriptions_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes and RLS for products
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_is_active ON products(is_active);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "Users can manage their own products"
  ON products FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create product_price_changes table
CREATE TABLE product_price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Price change
  old_base_amount BIGINT NOT NULL,
  new_base_amount BIGINT NOT NULL,
  difference BIGINT GENERATED ALWAYS AS (new_base_amount - old_base_amount) STORED,
  percentage_change NUMERIC GENERATED ALWAYS AS (
    ((new_base_amount - old_base_amount)::NUMERIC / old_base_amount * 100)
  ) STORED,
  
  -- Details
  reason TEXT NOT NULL,
  change_type price_change_type NOT NULL,
  
  -- Application
  application_type application_type NOT NULL,
  scheduled_date TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  
  -- Approval rules
  requires_approval_for_fixed BOOLEAN DEFAULT true,
  auto_suspend_fixed_until_approval BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applying', 'applied', 'cancelled')),
  
  -- Application statistics
  total_subscriptions_affected INTEGER DEFAULT 0,
  subscriptions_applied INTEGER DEFAULT 0,
  subscriptions_pending_approval INTEGER DEFAULT 0,
  subscriptions_failed INTEGER DEFAULT 0,
  
  -- Tracking
  changed_by UUID REFERENCES auth.users(id),
  internal_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes and RLS for product_price_changes
CREATE INDEX idx_product_price_changes_product ON product_price_changes(product_id);
ALTER TABLE product_price_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage price changes for their products"
  ON product_price_changes FOR ALL
  USING (product_id IN (
    SELECT id FROM products WHERE user_id = auth.uid()
  ));

-- Add product_id to subscriptions
ALTER TABLE subscriptions 
  ADD COLUMN product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  ADD COLUMN created_from_product BOOLEAN DEFAULT false;

CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);

-- Add product_price_change_id to subscription_price_changes
ALTER TABLE subscription_price_changes
  ADD COLUMN product_price_change_id UUID REFERENCES product_price_changes(id) ON DELETE SET NULL;

CREATE INDEX idx_subscription_price_changes_product_change 
  ON subscription_price_changes(product_price_change_id);

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for product_price_changes updated_at
CREATE TRIGGER update_product_price_changes_updated_at
BEFORE UPDATE ON product_price_changes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();