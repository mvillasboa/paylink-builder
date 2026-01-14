import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const requestSchema = z.object({
  product_price_change_id: z.string().uuid({ message: "Invalid product_price_change_id format" }),
});

// Sanitize error messages to prevent information leakage
function sanitizeError(error: unknown): string {
  console.error('Full error:', error);
  if (error instanceof z.ZodError) {
    return 'Invalid request data: ' + error.errors.map(e => e.message).join(', ');
  }
  // Return generic message for other errors
  return 'An error occurred while processing your request';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. VALIDATE AUTHENTICATION
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 2. EXTRACT USER FROM JWT
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { authorization: authHeader } } }
    );
    
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Invalid token:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);
    
    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = requestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ error: sanitizeError(validationResult.error) }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { product_price_change_id } = validationResult.data;
    
    console.log('Applying product price change:', product_price_change_id);
    
    // 3. CREATE SERVICE ROLE CLIENT for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // 4. Get the product price change WITH product ownership info
    const { data: priceChange, error: priceChangeError } = await supabase
      .from('product_price_changes')
      .select('*, products(id, user_id)')
      .eq('id', product_price_change_id)
      .single();
    
    if (priceChangeError || !priceChange) {
      console.error('Price change not found:', priceChangeError);
      return new Response(
        JSON.stringify({ error: 'Price change not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 5. AUTHORIZATION CHECK - Verify user owns the product
    if (priceChange.products.user_id !== userId) {
      console.error(`Unauthorized: User ${userId} attempted to apply price change for product owned by ${priceChange.products.user_id}`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 6. VALIDATE STATUS - Only allow pending price changes
    if (priceChange.status !== 'pending') {
      console.error(`Invalid status: Price change ${product_price_change_id} has status ${priceChange.status}`);
      return new Response(
        JSON.stringify({ error: 'Price change already processed or cancelled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Authorized: User ${userId} applying price change ${product_price_change_id}`);
    
    console.log('Price change loaded:', priceChange);
    
    // Update status to applying
    await supabase
      .from('product_price_changes')
      .update({ status: 'applying' })
      .eq('id', product_price_change_id);
    
    // 2. Get all active subscriptions for this product
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('product_id', priceChange.product_id)
      .in('status', ['active', 'trial']);
    
    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      throw subscriptionsError;
    }
    
    console.log(`Found ${subscriptions?.length || 0} subscriptions to process`);
    
    // 3. Process each subscription according to its type
    const results = {
      applied: 0,
      pending_approval: 0,
      failed: 0
    };
    
    for (const subscription of subscriptions || []) {
      try {
        const isVariable = subscription.type === 'variable';
        const requiresApproval = !isVariable && priceChange.requires_approval_for_fixed;
        
        if (isVariable || !requiresApproval) {
          // Apply change directly
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ 
              amount: priceChange.new_base_amount,
              last_price_change_date: new Date().toISOString(),
              price_change_history_count: (subscription.price_change_history_count || 0) + 1
            })
            .eq('id', subscription.id);
          
          if (updateError) {
            console.error(`Error updating subscription ${subscription.id}:`, updateError);
            results.failed++;
            continue;
          }
          
          // Record the change
          await supabase
            .from('subscription_price_changes')
            .insert({
              subscription_id: subscription.id,
              product_price_change_id: priceChange.id,
              old_amount: subscription.amount,
              new_amount: priceChange.new_base_amount,
              reason: priceChange.reason,
              change_type: priceChange.change_type,
              application_type: priceChange.application_type,
              requires_client_approval: false,
              client_approval_status: 'not_required',
              status: 'applied',
              applied_at: new Date().toISOString()
            });
          
          results.applied++;
          console.log(`Applied price change to subscription ${subscription.id}`);
        } else {
          // Create pending approval change
          const { data: tokenData } = await supabase.rpc('generate_approval_token');
          
          await supabase
            .from('subscription_price_changes')
            .insert({
              subscription_id: subscription.id,
              product_price_change_id: priceChange.id,
              old_amount: subscription.amount,
              new_amount: priceChange.new_base_amount,
              reason: priceChange.reason,
              change_type: priceChange.change_type,
              application_type: priceChange.application_type,
              requires_client_approval: true,
              client_approval_status: 'pending',
              approval_token: tokenData,
              status: 'pending'
            });
          
          // Suspend if configured
          if (priceChange.auto_suspend_fixed_until_approval) {
            await supabase
              .from('subscriptions')
              .update({ status: 'paused' })
              .eq('id', subscription.id);
          }
          
          results.pending_approval++;
          console.log(`Created pending approval for subscription ${subscription.id}`);
          
          // Insert notification log for WhatsApp
          await supabase
            .from('notification_logs')
            .insert({
              subscription_id: subscription.id,
              phone_number: subscription.phone_number,
              channel: 'whatsapp',
              event: 'price_change_approval_required',
              message: `Solicitud de aprobación de cambio de precio: ${subscription.concept}`,
              status: 'pending',
              cost_amount: priceChange.new_base_amount
            });
        }
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        results.failed++;
      }
    }
    
    console.log('Processing complete:', results);
    
    // 4. Update the product_price_change with results
    await supabase
      .from('product_price_changes')
      .update({
        status: 'applied',
        applied_at: new Date().toISOString(),
        total_subscriptions_affected: (subscriptions || []).length,
        subscriptions_applied: results.applied,
        subscriptions_pending_approval: results.pending_approval,
        subscriptions_failed: results.failed
      })
      .eq('id', product_price_change_id);
    
    // 5. Update the product's base_amount
    await supabase
      .from('products')
      .update({ base_amount: priceChange.new_base_amount })
      .eq('id', priceChange.product_id);
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
