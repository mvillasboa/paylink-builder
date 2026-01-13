import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const clientDataSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be 255 characters or less" }),
  phone_number: z.string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number must be 20 characters or less" })
    .regex(/^[\d\s+\-()]+$/, { message: "Invalid phone number format" }),
  city: z.string()
    .trim()
    .max(100, { message: "City must be 100 characters or less" })
    .optional(),
  country: z.string()
    .trim()
    .max(100, { message: "Country must be 100 characters or less" })
    .optional()
    .default('Paraguay'),
});

const requestSchema = z.object({
  token: z.string()
    .trim()
    .min(1, { message: "Token is required" })
    .max(128, { message: "Invalid token format" }),
  clientData: clientDataSchema,
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    
    const { token, clientData } = validationResult.data;

    console.log('Validating product link token');

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

    console.log('Creating/finding client');

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
      // Create new client with validated data
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: productLink.user_id,
          name: clientData.name,
          email: clientData.email,
          phone_number: clientData.phone_number,
          city: clientData.city || null,
          country: clientData.country,
        })
        .select()
        .single();

      if (clientError) {
        console.error('Error creating client:', clientError);
        return new Response(
          JSON.stringify({ error: 'Error creating client record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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
    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
