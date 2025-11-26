import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { token, clientData } = await req.json();

    console.log('Validating product link token:', token);

    // Validate product link
    const { data: productLink, error: linkError } = await supabase
      .from('product_links')
      .select('*, products(*)')
      .eq('token', token)
      .single();

    if (linkError || !productLink) {
      console.error('Invalid token:', linkError);
      return new Response(
        JSON.stringify({ error: 'Link inválido o expirado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if link is still valid
    if (productLink.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Este link ya no está activo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (productLink.expires_at && new Date(productLink.expires_at) < new Date()) {
      // Update status to expired
      await supabase
        .from('product_links')
        .update({ status: 'expired' })
        .eq('id', productLink.id);

      return new Response(
        JSON.stringify({ error: 'Este link ha expirado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (productLink.max_uses && productLink.uses_count >= productLink.max_uses) {
      // Update status to used
      await supabase
        .from('product_links')
        .update({ status: 'used' })
        .eq('id', productLink.id);

      return new Response(
        JSON.stringify({ error: 'Este link ha alcanzado su límite de usos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating/finding client:', clientData);

    // Try to find existing client by email
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', productLink.user_id)
      .eq('email', clientData.email)
      .single();

    let clientId: string;

    if (existingClient) {
      clientId = existingClient.id;
      console.log('Using existing client:', clientId);
    } else {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: productLink.user_id,
          name: clientData.name,
          email: clientData.email,
          phone_number: clientData.phone_number,
          city: clientData.city,
          country: clientData.country || 'Paraguay',
        })
        .select()
        .single();

      if (clientError) {
        console.error('Error creating client:', clientError);
        throw clientError;
      }

      clientId = newClient.id;
      console.log('Created new client:', clientId);
    }

    // Generate a temporary subscription token for the next step
    const { data: subscriptionToken } = await supabase
      .rpc('generate_payment_link_token');

    // Increment uses_count
    await supabase
      .from('product_links')
      .update({ uses_count: productLink.uses_count + 1 })
      .eq('id', productLink.id);

    console.log('Registration successful');

    return new Response(
      JSON.stringify({
        client_id: clientId,
        product_id: productLink.product_id,
        subscription_token: subscriptionToken,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in register-from-product-link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
