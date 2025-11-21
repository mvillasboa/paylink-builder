import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const today = new Date();
    
    console.log(`[apply-price-changes] Running for date: ${today.toISOString()}`);

    // 1. Buscar cambios programados para hoy que estén aprobados o no requieran aprobación
    const { data: scheduledChanges, error: fetchError } = await supabase
      .from('subscription_price_changes')
      .select('*, subscriptions(*)')
      .eq('status', 'scheduled')
      .lte('scheduled_date', today.toISOString())
      .or('client_approval_status.eq.approved,client_approval_status.eq.not_required');

    if (fetchError) throw fetchError;

    console.log(`[apply-price-changes] Found ${scheduledChanges?.length || 0} changes to apply`);

    // 2. Aplicar cada cambio
    const results = [];
    for (const change of scheduledChanges || []) {
      try {
        await applyPriceChange(supabase, change);
        console.log(`[apply-price-changes] Applied change ${change.id} for subscription ${change.subscription_id}`);
        results.push({ id: change.id, status: 'success' });
      } catch (error: any) {
        console.error(`[apply-price-changes] Error applying change ${change.id}:`, error);
        results.push({ id: change.id, status: 'error', error: error.message });
      }
    }

    // 3. Buscar aprobaciones pendientes que excedan 7 días y aplicar automáticamente
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const { data: expiredApprovals, error: expiredError } = await supabase
      .from('subscription_price_changes')
      .select('*, subscriptions(*)')
      .eq('status', 'pending')
      .eq('requires_client_approval', true)
      .eq('client_approval_status', 'pending')
      .lte('created_at', sevenDaysAgo.toISOString());

    if (expiredError) throw expiredError;

    console.log(`[apply-price-changes] Found ${expiredApprovals?.length || 0} expired approvals`);

    for (const change of expiredApprovals || []) {
      try {
        // Auto-aprobar
        await supabase
          .from('subscription_price_changes')
          .update({
            client_approval_status: 'approved',
            client_approval_date: today.toISOString(),
            client_approval_method: 'auto_approved_no_response',
          })
          .eq('id', change.id);

        // Aplicar el cambio
        await applyPriceChange(supabase, change);

        console.log(`[apply-price-changes] Auto-approved and applied change ${change.id}`);
        results.push({ id: change.id, status: 'auto_approved' });
      } catch (error: any) {
        console.error(`[apply-price-changes] Error auto-approving change ${change.id}:`, error);
        results.push({ id: change.id, status: 'error', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        appliedChanges: scheduledChanges?.length || 0,
        autoApprovedChanges: expiredApprovals?.length || 0,
        results,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('[apply-price-changes] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function applyPriceChange(supabase: any, change: any) {
  const now = new Date();

  // 1. Actualizar el monto en la suscripción
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      amount: change.new_amount,
      last_price_change_date: now.toISOString(),
      price_change_history_count: change.subscriptions.price_change_history_count + 1,
      pending_price_change_id: null,
    })
    .eq('id', change.subscription_id);

  if (updateError) throw updateError;

  // 2. Marcar el cambio como aplicado
  const { error: changeError } = await supabase
    .from('subscription_price_changes')
    .update({
      status: 'applied',
      applied_at: now.toISOString(),
    })
    .eq('id', change.id);

  if (changeError) throw changeError;

  // 3. Registrar log de notificación
  await supabase
    .from('notification_logs')
    .insert({
      subscription_id: change.subscription_id,
      phone_number: change.subscriptions.phone_number,
      channel: 'whatsapp',
      event: 'price_change_applied',
      message: `Cambio de precio aplicado: ${change.subscriptions.reference}. Nuevo monto: ${change.new_amount}`,
      status: 'pending',
    });

  console.log(`Applied price change ${change.id}: ${change.old_amount} -> ${change.new_amount}`);
}
