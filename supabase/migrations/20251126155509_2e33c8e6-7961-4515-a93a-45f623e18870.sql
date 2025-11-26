-- Create enum for product link status
CREATE TYPE public.product_link_status AS ENUM ('active', 'used', 'expired', 'cancelled');

-- Create product_links table
CREATE TABLE public.product_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  short_code TEXT,
  status product_link_status NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT 1,
  uses_count INTEGER NOT NULL DEFAULT 0,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for operators
CREATE POLICY "Users can manage their own product links"
ON public.product_links
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policy for public validation
CREATE POLICY "Anyone with token can view product link"
ON public.product_links
FOR SELECT
USING (token IS NOT NULL);

-- Function to generate product link token
CREATE OR REPLACE FUNCTION public.generate_product_link_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_product_links_updated_at
BEFORE UPDATE ON public.product_links
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();