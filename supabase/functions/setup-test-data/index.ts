import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestDataResponse {
  success: boolean;
  message: string;
  credentials?: {
    email: string;
    password: string;
  };
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting test data setup...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const testEmail = 'test@paylink.com';
    const testPassword = 'TestPassword123!';

    // 1. Delete existing test user if exists
    console.log('Checking for existing test user...');
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === testEmail);
    
    if (existingUser) {
      console.log('Deleting existing test user and associated data...');
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
    }

    // 2. Create test user
    console.log('Creating test user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create user: ${authError?.message}`);
    }

    const userId = authData.user.id;
    console.log(`Test user created with ID: ${userId}`);

    // 3. Insert clients
    console.log('Inserting clients...');
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .insert([
        {
          user_id: userId,
          name: 'María García',
          email: 'maria.garcia@example.com',
          phone_number: '+595981234567',
          address: 'Av. España 1234',
          city: 'Asunción',
          country: 'Paraguay',
          is_active: true,
          total_spent: 450000,
          active_subscriptions: 2,
          total_subscriptions: 2,
        },
        {
          user_id: userId,
          name: 'Juan Rodríguez',
          email: 'juan.rodriguez@example.com',
          phone_number: '+595982345678',
          address: 'Av. Mariscal López 5678',
          city: 'Asunción',
          country: 'Paraguay',
          is_active: true,
          total_spent: 120000,
          active_subscriptions: 1,
          total_subscriptions: 1,
        },
        {
          user_id: userId,
          name: 'Ana Martínez',
          email: 'ana.martinez@example.com',
          phone_number: '+595983456789',
          address: 'Av. Aviadores del Chaco 910',
          city: 'Asunción',
          country: 'Paraguay',
          is_active: true,
          total_spent: 890000,
          active_subscriptions: 3,
          total_subscriptions: 4,
        },
        {
          user_id: userId,
          name: 'Carlos López',
          email: 'carlos.lopez@example.com',
          phone_number: '+595984567890',
          address: 'Av. San Martín 1122',
          city: 'Asunción',
          country: 'Paraguay',
          is_active: true,
          total_spent: 1250000,
          active_subscriptions: 2,
          total_subscriptions: 3,
        },
        {
          user_id: userId,
          name: 'Laura Sánchez',
          email: 'laura.sanchez@example.com',
          phone_number: '+595985678901',
          address: 'Av. República Argentina 3344',
          city: 'Asunción',
          country: 'Paraguay',
          is_active: false,
          total_spent: 50000,
          active_subscriptions: 0,
          total_subscriptions: 1,
        },
      ])
      .select();

    if (clientsError) throw new Error(`Failed to insert clients: ${clientsError.message}`);
    console.log(`Inserted ${clients.length} clients`);

    // 4. Insert cards
    console.log('Inserting cards...');
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from('cards')
      .insert([
        {
          user_id: userId,
          client_id: clients[0].id,
          token: crypto.randomUUID(),
          last_four_digits: '4242',
          card_brand: 'visa',
          cardholder_name: 'MARÍA GARCÍA',
          expiry_month: '12',
          expiry_year: '26',
          is_default: true,
          status: 'active',
          total_transactions: 15,
          last_used_at: new Date().toISOString(),
        },
        {
          user_id: userId,
          client_id: clients[1].id,
          token: crypto.randomUUID(),
          last_four_digits: '5555',
          card_brand: 'mastercard',
          cardholder_name: 'JUAN RODRÍGUEZ',
          expiry_month: '08',
          expiry_year: '25',
          is_default: true,
          status: 'active',
          total_transactions: 8,
          last_used_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          user_id: userId,
          client_id: clients[2].id,
          token: crypto.randomUUID(),
          last_four_digits: '1234',
          card_brand: 'amex',
          cardholder_name: 'ANA MARTÍNEZ',
          expiry_month: '03',
          expiry_year: '27',
          is_default: true,
          status: 'active',
          total_transactions: 22,
          last_used_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select();

    if (cardsError) throw new Error(`Failed to insert cards: ${cardsError.message}`);
    console.log(`Inserted ${cards.length} cards`);

    // 5. Insert products
    console.log('Inserting products...');
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .insert([
        {
          user_id: userId,
          name: 'Plan Básico Mensual',
          description: 'Acceso completo a todas las funcionalidades básicas',
          internal_code: 'BASIC-MONTHLY',
          type: 'fixed',
          base_amount: 50000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          trial_period_days: 0,
          allow_price_modification: true,
          auto_apply_price_changes: false,
          send_reminder_before_charge: true,
          allow_pause: false,
          is_active: true,
          active_subscriptions_count: 3,
          total_subscriptions_count: 5,
        },
        {
          user_id: userId,
          name: 'Plan Premium Anual',
          description: 'Plan anual con descuento y funcionalidades premium',
          internal_code: 'PREMIUM-YEARLY',
          type: 'fixed',
          base_amount: 500000,
          frequency: 'yearly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          trial_period_days: 0,
          allow_price_modification: true,
          auto_apply_price_changes: false,
          send_reminder_before_charge: true,
          allow_pause: false,
          is_active: true,
          active_subscriptions_count: 1,
          total_subscriptions_count: 2,
        },
        {
          user_id: userId,
          name: 'Consultoría por Hora',
          description: 'Servicio de consultoría con tarifa variable',
          internal_code: 'CONSULTING-HOURLY',
          type: 'variable',
          base_amount: 150000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          trial_period_days: 0,
          allow_price_modification: true,
          auto_apply_price_changes: false,
          send_reminder_before_charge: true,
          allow_pause: true,
          is_active: true,
          active_subscriptions_count: 2,
          total_subscriptions_count: 3,
        },
        {
          user_id: userId,
          name: 'Membresía 6 Meses',
          description: 'Membresía con duración limitada a 6 pagos',
          internal_code: 'MEMBERSHIP-6M',
          type: 'fixed',
          base_amount: 80000,
          frequency: 'monthly',
          duration_type: 'limited',
          number_of_payments: 6,
          first_charge_type: 'immediate',
          trial_period_days: 0,
          allow_price_modification: false,
          auto_apply_price_changes: false,
          send_reminder_before_charge: true,
          allow_pause: false,
          is_active: true,
          active_subscriptions_count: 1,
          total_subscriptions_count: 2,
        },
        {
          user_id: userId,
          name: 'Servicio Cloud',
          description: 'Servicio de hosting en la nube con facturación variable',
          internal_code: 'CLOUD-SERVICE',
          type: 'variable',
          base_amount: 100000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          trial_period_days: 0,
          allow_price_modification: true,
          auto_apply_price_changes: true,
          send_reminder_before_charge: true,
          allow_pause: true,
          is_active: true,
          active_subscriptions_count: 1,
          total_subscriptions_count: 1,
        },
        {
          user_id: userId,
          name: 'Pack Starter',
          description: 'Pack inicial con 7 días de prueba gratis',
          internal_code: 'STARTER-PACK',
          type: 'fixed',
          base_amount: 35000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'scheduled',
          trial_period_days: 7,
          allow_price_modification: true,
          auto_apply_price_changes: false,
          send_reminder_before_charge: true,
          allow_pause: false,
          is_active: true,
          active_subscriptions_count: 1,
          total_subscriptions_count: 1,
        },
      ])
      .select();

    if (productsError) throw new Error(`Failed to insert products: ${productsError.message}`);
    console.log(`Inserted ${products.length} products`);

    // 6. Insert subscriptions
    console.log('Inserting subscriptions...');
    const now = new Date();
    const { data: subscriptions, error: subscriptionsError } = await supabaseAdmin
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          client_id: clients[0].id,
          client_name: clients[0].name,
          client_email: clients[0].email,
          phone_number: clients[0].phone_number,
          card_id: cards[0].id,
          product_id: products[0].id,
          reference: 'SUB-001',
          concept: products[0].name,
          description: 'Suscripción activa',
          type: 'fixed',
          amount: 50000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          billing_day: 15,
          next_charge_date: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString(),
          status: 'active',
          payments_completed: 5,
          created_from_product: true,
        },
        {
          user_id: userId,
          client_id: clients[1].id,
          client_name: clients[1].name,
          client_email: clients[1].email,
          phone_number: clients[1].phone_number,
          card_id: cards[1].id,
          product_id: products[2].id,
          reference: 'SUB-002',
          concept: products[2].name,
          description: 'Consultoría mensual',
          type: 'variable',
          amount: 150000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          billing_day: 1,
          next_charge_date: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
          status: 'active',
          allow_pause: true,
          payments_completed: 3,
          created_from_product: true,
        },
        {
          user_id: userId,
          client_id: clients[2].id,
          client_name: clients[2].name,
          client_email: clients[2].email,
          phone_number: clients[2].phone_number,
          card_id: cards[2].id,
          product_id: products[1].id,
          reference: 'SUB-003',
          concept: products[1].name,
          description: 'Plan premium anual',
          type: 'fixed',
          amount: 500000,
          frequency: 'yearly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          billing_day: 1,
          next_charge_date: new Date(now.getFullYear() + 1, 0, 1).toISOString(),
          status: 'active',
          payments_completed: 1,
          created_from_product: true,
        },
        {
          user_id: userId,
          client_id: clients[0].id,
          client_name: clients[0].name,
          client_email: clients[0].email,
          phone_number: clients[0].phone_number,
          card_id: cards[0].id,
          product_id: products[3].id,
          reference: 'SUB-004',
          concept: products[3].name,
          description: 'Membresía limitada',
          type: 'fixed',
          amount: 80000,
          frequency: 'monthly',
          duration_type: 'limited',
          number_of_payments: 6,
          first_charge_type: 'immediate',
          billing_day: 10,
          next_charge_date: new Date(now.getFullYear(), now.getMonth() + 1, 10).toISOString(),
          status: 'active',
          payments_completed: 2,
          created_from_product: true,
        },
        {
          user_id: userId,
          client_id: clients[3].id,
          client_name: clients[3].name,
          client_email: clients[3].email,
          phone_number: clients[3].phone_number,
          reference: 'SUB-005',
          concept: 'Suscripción Pausada',
          description: 'En pausa temporal',
          type: 'fixed',
          amount: 50000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          billing_day: 5,
          next_charge_date: new Date(now.getFullYear(), now.getMonth() + 2, 5).toISOString(),
          status: 'paused',
          paused_at: now.toISOString(),
          paused_until: new Date(now.getFullYear(), now.getMonth() + 1, 5).toISOString(),
          allow_pause: true,
          payments_completed: 8,
        },
        {
          user_id: userId,
          client_id: clients[4].id,
          client_name: clients[4].name,
          client_email: clients[4].email,
          phone_number: clients[4].phone_number,
          reference: 'SUB-006',
          concept: 'Suscripción Cancelada',
          description: 'Cancelada por el cliente',
          type: 'fixed',
          amount: 35000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          billing_day: 20,
          next_charge_date: new Date(now.getFullYear(), now.getMonth() + 1, 20).toISOString(),
          status: 'cancelled',
          cancelled_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          cancelled_reason: 'Cliente solicitó cancelación',
          payments_completed: 4,
        },
        {
          user_id: userId,
          client_id: clients[2].id,
          client_name: clients[2].name,
          client_email: clients[2].email,
          phone_number: clients[2].phone_number,
          card_id: cards[2].id,
          product_id: products[4].id,
          reference: 'SUB-007',
          concept: products[4].name,
          description: 'Servicio cloud variable',
          type: 'variable',
          amount: 100000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'immediate',
          billing_day: 1,
          next_charge_date: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
          status: 'active',
          allow_pause: true,
          payments_completed: 6,
          created_from_product: true,
        },
        {
          user_id: userId,
          client_id: clients[3].id,
          client_name: clients[3].name,
          client_email: clients[3].email,
          phone_number: clients[3].phone_number,
          product_id: products[5].id,
          reference: 'SUB-008',
          concept: products[5].name,
          description: 'En período de prueba',
          type: 'fixed',
          amount: 35000,
          frequency: 'monthly',
          duration_type: 'unlimited',
          first_charge_type: 'scheduled',
          trial_period_days: 7,
          first_charge_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          billing_day: 25,
          next_charge_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'trial',
          payments_completed: 0,
          created_from_product: true,
        },
      ])
      .select();

    if (subscriptionsError) throw new Error(`Failed to insert subscriptions: ${subscriptionsError.message}`);
    console.log(`Inserted ${subscriptions.length} subscriptions`);

    // 7. Insert transactions
    console.log('Inserting transactions...');
    const transactions = [];
    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const client = clients[Math.floor(Math.random() * clients.length)];
      const subscription = subscriptions[Math.floor(Math.random() * Math.min(5, subscriptions.length))];
      const statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'failed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      transactions.push({
        id: crypto.randomUUID(),
        user_id: userId,
        client_id: client.id,
        client_name: client.name,
        client_email: client.email,
        subscription_id: subscription?.id,
        card_id: cards[Math.floor(Math.random() * cards.length)].id,
        concept: subscription?.concept || 'Pago único',
        amount: Math.floor(Math.random() * 200000) + 30000,
        method: ['visa', 'mastercard', 'amex'][Math.floor(Math.random() * 3)],
        status: status as 'completed' | 'pending' | 'failed',
        failure_reason: status === 'failed' ? 'Fondos insuficientes' : null,
        created_at: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    const { error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .insert(transactions);

    if (transactionsError) throw new Error(`Failed to insert transactions: ${transactionsError.message}`);
    console.log(`Inserted ${transactions.length} transactions`);

    // 8. Insert payment links
    console.log('Inserting payment links...');
    const { error: paymentLinksError } = await supabaseAdmin
      .from('payment_links')
      .insert([
        {
          user_id: userId,
          client_id: clients[0].id,
          token: crypto.randomUUID(),
          recipient_name: clients[0].name,
          recipient_email: clients[0].email,
          recipient_phone: clients[0].phone_number,
          concept: 'Pago de servicio',
          description: 'Link activo pendiente de pago',
          amount: 75000,
          status: 'active',
          channel: 'whatsapp',
          expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          user_id: userId,
          client_id: clients[1].id,
          token: crypto.randomUUID(),
          recipient_name: clients[1].name,
          recipient_email: clients[1].email,
          recipient_phone: clients[1].phone_number,
          concept: 'Consultoría',
          description: 'Link pagado exitosamente',
          amount: 150000,
          status: 'paid',
          channel: 'email',
          sent_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          first_viewed_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          paid_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          user_id: userId,
          client_id: clients[2].id,
          token: crypto.randomUUID(),
          recipient_name: clients[2].name,
          recipient_email: clients[2].email,
          recipient_phone: clients[2].phone_number,
          concept: 'Factura #1234',
          description: 'Link expirado',
          amount: 95000,
          status: 'expired',
          channel: 'sms',
          sent_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          user_id: userId,
          client_id: clients[3].id,
          token: crypto.randomUUID(),
          recipient_name: clients[3].name,
          recipient_email: clients[3].email,
          recipient_phone: clients[3].phone_number,
          concept: 'Pago mensual',
          description: 'Link cancelado por el usuario',
          amount: 50000,
          status: 'cancelled',
          channel: 'manual',
        },
        {
          user_id: userId,
          client_id: clients[0].id,
          token: crypto.randomUUID(),
          recipient_name: clients[0].name,
          recipient_email: clients[0].email,
          recipient_phone: clients[0].phone_number,
          concept: 'Renovación anual',
          description: 'Link enviado pero no visualizado',
          amount: 500000,
          status: 'sent',
          channel: 'whatsapp',
          sent_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

    if (paymentLinksError) throw new Error(`Failed to insert payment links: ${paymentLinksError.message}`);
    console.log('Inserted 5 payment links');

    console.log('Test data setup completed successfully!');

    const response: TestDataResponse = {
      success: true,
      message: 'Test data created successfully',
      credentials: {
        email: testEmail,
        password: testPassword,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error setting up test data:', error);
    const response: TestDataResponse = {
      success: false,
      message: 'Failed to setup test data',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
