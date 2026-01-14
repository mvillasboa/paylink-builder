import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const requestSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  action: z.enum(['approve', 'reject'], { errorMap: () => ({ message: "Action must be 'approve' or 'reject'" }) }),
});

// Sanitize error messages to prevent information leakage
function sanitizeError(error: unknown): string {
  console.error('Full error:', error);
  if (error instanceof z.ZodError) {
    return 'Invalid request data';
  }
  return 'An error occurred while processing your request';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    
    const { token, action } = validationResult.data;
    
    console.log(`Processing ${action} request for token`);
    
    // Create service role client to bypass RLS for this specific operation
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Verify token exists and change is still pending
    const { data: change, error: fetchError } = await supabase
      .from('subscription_price_changes')
      .select('id, subscription_id, client_approval_status, new_amount, old_amount')
      .eq('approval_token', token)
      .eq('client_approval_status', 'pending')
      .single();
      
    if (fetchError || !change) {
      console.error('Token validation failed:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Token inválido o cambio ya procesado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found pending change ${change.id} for subscription ${change.subscription_id}`);
    
    // Prepare update data based on action
    const updateData: Record<string, unknown> = {
      client_approval_status: action === 'approve' ? 'approved' : 'rejected',
      client_approval_date: new Date().toISOString(),
      client_approval_method: 'web',
    };
    
    // If rejected, also cancel the change
    if (action === 'reject') {
      updateData.status = 'cancelled';
    }
    
    // Update the price change record
    const { error: updateError } = await supabase
      .from('subscription_price_changes')
      .update(updateData)
      .eq('id', change.id);
      
    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }
    
    console.log(`Successfully ${action}d change ${change.id}`);
    
    // If approved and there's a subscription that was paused, we may need to reactivate it
    // This depends on business logic - for now we leave it as is
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        action,
        message: action === 'approve' ? 'Cambio aprobado exitosamente' : 'Cambio rechazado'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
