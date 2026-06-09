
-- Drop overly-permissive token policies
DROP POLICY IF EXISTS "Anyone with token can view payment link" ON public.payment_links;
DROP POLICY IF EXISTS "Anyone with token can view product link" ON public.product_links;
DROP POLICY IF EXISTS "Anyone with token can view price change for approval" ON public.subscription_price_changes;

-- Token-scoped accessor: product link by token (used by public product landing page)
CREATE OR REPLACE FUNCTION public.get_product_link_by_token(p_token text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(pl) || jsonb_build_object('products', to_jsonb(p))
  FROM public.product_links pl
  LEFT JOIN public.products p ON p.id = pl.product_id
  WHERE pl.token = p_token
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_product_link_by_token(text) TO anon, authenticated;

-- Token-scoped accessor: pending price change approval (used by public approval page)
CREATE OR REPLACE FUNCTION public.get_price_change_by_approval_token(p_token text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(spc) || jsonb_build_object(
    'subscriptions',
    to_jsonb(s) - 'user_id'
  )
  FROM public.subscription_price_changes spc
  LEFT JOIN public.subscriptions s ON s.id = spc.subscription_id
  WHERE spc.approval_token = p_token
    AND spc.client_approval_status = 'pending'
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_price_change_by_approval_token(text) TO anon, authenticated;

-- Stop broadcasting cross-tenant tables over Realtime (no RLS exists on realtime.messages,
-- so any authenticated user could otherwise subscribe to other users' row changes).
ALTER PUBLICATION supabase_realtime DROP TABLE public.subscriptions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.subscription_price_changes;
ALTER PUBLICATION supabase_realtime DROP TABLE public.transactions;
