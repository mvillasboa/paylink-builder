import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, FileText, Printer } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocumentSection } from "@/components/docs/DocumentSection";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { downloadMarkdown, generateMarkdownDoc } from "@/lib/utils/markdown";

export default function DatabaseSchemaGuide() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const sections = [
      {
        title: "Visión General",
        content: "Documentación completa del esquema de base de datos para el sistema de gestión de suscripciones recurrentes."
      },
      // Add all sections content here for markdown export
    ];
    
    const markdown = generateMarkdownDoc("Documentación de Base de Datos", sections);
    downloadMarkdown(markdown, "database-schema-guide");
    toast.success("Markdown descargado correctamente");
  };

  const handleCopyAll = () => {
    const content = document.querySelector('.documentation-content')?.textContent || '';
    navigator.clipboard.writeText(content);
    toast.success("Contenido copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Documentación de Base de Datos
              </h1>
              <p className="text-muted-foreground">
                Esquema completo con ejemplos SQL para el sistema de suscripciones
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar Todo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadMarkdown}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar MD
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir PDF
              </Button>
            </div>
          </div>
        </div>

        <Card className="p-8 documentation-content">
          <DocumentSection title="1. Visión General" level={1}>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Este documento describe el esquema de base de datos para un sistema completo de gestión de suscripciones recurrentes. 
              El sistema permite gestionar productos, suscripciones de clientes, cambios de precio (individuales y masivos), 
              notificaciones y transacciones de pago.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Diagrama de Relaciones</h3>
            <CodeBlock language="text" code={`
┌──────────────┐         ┌─────────────────┐         ┌──────────────────────────┐
│   products   │◄────────│  subscriptions  │◄────────│ subscription_price_      │
│              │ 1     * │                 │ 1     * │      changes             │
│ - id         │         │ - id            │         │ - id                     │
│ - user_id    │         │ - product_id    │         │ - subscription_id        │
│ - name       │         │ - client_id     │         │ - old_amount             │
│ - base_amount│         │ - card_id       │         │ - new_amount             │
└──────┬───────┘         │ - reference     │         │ - approval_token         │
       │                 │ - client_name   │         └──────────────────────────┘
       │                 │ - amount        │                      ▲
       │                 │ - status        │                      │
       │                 └────────┬────────┘                      │
       │ 1                   ▲    │ 1                             │
       │                     │    │                               │
       │                     │    │                               │
       │ *                   │    │ *                             │
┌──────▼───────────────┐    │    │    ┌──────────────────┐      │
│ product_price_       │    │    └────│ notification_    │      │
│    changes           │    │         │     logs         │      │
│ - id                 │    │         │ - subscription_id│◄─────┘
│ - product_id         │    │         │ - channel        │
│ - old_base_amount    │    │         │ - event          │
│ - new_base_amount    │    │         │ - status         │
│ - status             │    │         └──────────────────┘
└──────────────────────┘    │
                            │
┌──────────────┐            │         ┌──────────────────┐
│   clients    │◄───────────┘         │  payment_links   │
│              │ 1         *           │                  │
│ - id         │                       │ - id             │
│ - user_id    │◄──────────────────────│ - client_id      │
│ - name       │ 1                   * │ - subscription_id│
│ - email      │                       │ - token          │
│ - phone      │                       │ - amount         │
└──────┬───────┘                       │ - status         │
       │ 1                             └──────────────────┘
       │
       │ *
┌──────▼────────┐          ┌──────────────────┐
│     cards     │          │  transactions    │
│               │          │                  │
│ - id          │          │ - id             │
│ - client_id   │◄─────────│ - card_id        │
│ - token       │ 1      * │ - client_id      │
│ - last_four   │          │ - subscription_id│
│ - status      │          │ - payment_link_id│
└───────────────┘          │ - user_id        │
                           │ - amount         │
                           │ - status         │
                           └──────────────────┘
            `} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Convenciones de Nombrado</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li><strong>snake_case</strong> para todos los nombres de tablas y columnas</li>
              <li><strong>Timestamps automáticos:</strong> created_at, updated_at con triggers</li>
              <li><strong>IDs:</strong> UUID como primary keys (excepto transactions que usa text)</li>
              <li><strong>Foreign Keys:</strong> sufijo _id (product_id, subscription_id)</li>
              <li><strong>Enums:</strong> tipos personalizados de PostgreSQL</li>
            </ul>
          </DocumentSection>

          <DocumentSection title="2. Enumeraciones (Enums)" level={1}>
            <p className="text-foreground/80 mb-4">
              El sistema utiliza 13 tipos de enumeraciones personalizadas para garantizar la integridad de datos:
            </p>

            <CodeBlock language="sql" code={`-- 1. Tipo de suscripción
CREATE TYPE subscription_type AS ENUM (
  'fixed',      -- Monto fijo
  'variable',   -- Monto variable (puede cambiar)
  'single'      -- Pago único
);

-- 2. Estado de suscripción
CREATE TYPE subscription_status AS ENUM (
  'active',     -- Activa y cobrando
  'paused',     -- Pausada temporalmente
  'cancelled',  -- Cancelada por el usuario
  'expired',    -- Expirada (limitadas completadas)
  'trial'       -- En período de prueba
);

-- 3. Frecuencia de cobro
CREATE TYPE subscription_frequency AS ENUM (
  'weekly',     -- Semanal
  'biweekly',   -- Quincenal
  'monthly',    -- Mensual
  'bimonthly',  -- Bimensual
  'quarterly',  -- Trimestral
  'semiannual', -- Semestral
  'annual',     -- Anual
  'yearly'      -- Anual (alias)
);

-- 4. Tipo de duración
CREATE TYPE duration_type AS ENUM (
  'unlimited',  -- Sin límite de pagos
  'limited'     -- Número fijo de pagos
);

-- 5. Tipo de primer cobro
CREATE TYPE first_charge_type AS ENUM (
  'immediate',  -- Cobrar inmediatamente al crear
  'scheduled'   -- Cobrar en fecha programada
);

-- 6. Tipo de cambio de precio
CREATE TYPE price_change_type AS ENUM (
  'upgrade',    -- Aumento de precio (mejora)
  'downgrade',  -- Reducción de precio
  'inflation',  -- Ajuste por inflación
  'custom'      -- Cambio personalizado
);

-- 7. Tipo de aplicación
CREATE TYPE application_type AS ENUM (
  'immediate',  -- Aplicar inmediatamente
  'next_cycle', -- Aplicar en próximo ciclo
  'scheduled'   -- Aplicar en fecha específica
);

-- 8. Estado de aprobación del cliente
CREATE TYPE client_approval_status AS ENUM (
  'pending',      -- Pendiente de aprobación
  'approved',     -- Aprobado por el cliente
  'rejected',     -- Rechazado por el cliente
  'not_required'  -- No requiere aprobación
);

-- 9. Estado de transacción
CREATE TYPE transaction_status AS ENUM (
  'pending',    -- Pendiente de procesamiento
  'completed',  -- Completada exitosamente
  'failed'      -- Fallida
);

-- 10. Marca de tarjeta
CREATE TYPE card_brand AS ENUM (
  'visa',       -- Visa
  'mastercard', -- Mastercard
  'amex',       -- American Express
  'discover',   -- Discover
  'other'       -- Otras marcas
);

-- 11. Estado de tarjeta
CREATE TYPE card_status AS ENUM (
  'active',     -- Activa y disponible
  'expired',    -- Expirada
  'blocked',    -- Bloqueada por seguridad
  'removed'     -- Eliminada del sistema
);

-- 12. Canal de envío del payment link
CREATE TYPE payment_link_channel AS ENUM (
  'whatsapp',   -- WhatsApp
  'sms',        -- SMS
  'email',      -- Email
  'manual'      -- Enlace copiado manualmente
);

-- 13. Estado del payment link
CREATE TYPE payment_link_status AS ENUM (
  'active',     -- Activo, listo para usar
  'sent',       -- Enviado al cliente
  'viewed',     -- Cliente vio el enlace
  'paid',       -- Pago completado
  'expired',    -- Expirado
  'cancelled'   -- Cancelado
);`} />
          </DocumentSection>

          <DocumentSection title="3. Tabla: products" level={1} id="products">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Define los productos o planes de suscripción base que pueden ser asignados a múltiples clientes. 
              Cada producto establece las reglas de facturación, frecuencia y configuraciones que se heredarán a las suscripciones.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE products (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  internal_code TEXT,  -- Código interno para referencia
  
  -- Configuración de suscripción
  type subscription_type NOT NULL,
  base_amount BIGINT NOT NULL,  -- Monto en centavos
  frequency subscription_frequency NOT NULL,
  duration_type duration_type NOT NULL,
  number_of_payments INTEGER,  -- Solo si duration_type = 'limited'
  
  -- Configuración de cobros
  first_charge_type first_charge_type DEFAULT 'immediate',
  trial_period_days INTEGER DEFAULT 0,
  
  -- Configuraciones adicionales
  allow_price_modification BOOLEAN DEFAULT true,
  auto_apply_price_changes BOOLEAN DEFAULT false,
  send_reminder_before_charge BOOLEAN DEFAULT true,
  allow_pause BOOLEAN DEFAULT true,
  
  -- Metadatos
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  
  -- Contadores (actualizados por triggers)
  active_subscriptions_count INTEGER DEFAULT 0,
  total_subscriptions_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_is_active ON products(is_active);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>
            
            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Listar productos activos del usuario</h4>
            <CodeBlock language="sql" code={`SELECT id, name, base_amount, frequency, type, 
       active_subscriptions_count
FROM products
WHERE user_id = 'USER_UUID_HERE'
  AND is_active = true
ORDER BY created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Buscar productos por nombre o código</h4>
            <CodeBlock language="sql" code={`SELECT * FROM products
WHERE user_id = 'USER_UUID_HERE'
  AND (name ILIKE '%Premium%' 
       OR internal_code = 'PLAN-001');`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Crear un nuevo producto</h4>
            <CodeBlock language="sql" code={`INSERT INTO products (
  user_id, name, description, type, base_amount, 
  frequency, duration_type, allow_price_modification
) VALUES (
  'USER_UUID', 
  'Plan Premium', 
  'Acceso completo mensual', 
  'fixed', 
  50000,  -- 500.00 en tu moneda
  'monthly', 
  'unlimited', 
  true
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Actualizar precio base</h4>
            <CodeBlock language="sql" code={`UPDATE products
SET base_amount = 60000, 
    updated_at = NOW()
WHERE id = 'PRODUCT_UUID' 
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Productos con más suscripciones activas (Top performers)</h4>
            <CodeBlock language="sql" code={`SELECT name, 
       base_amount, 
       active_subscriptions_count,
       (base_amount * active_subscriptions_count) as monthly_revenue
FROM products
WHERE user_id = 'USER_UUID' 
  AND is_active = true
ORDER BY active_subscriptions_count DESC
LIMIT 10;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Desactivar producto (soft delete)</h4>
            <CodeBlock language="sql" code={`UPDATE products
SET is_active = false, 
    updated_at = NOW()
WHERE id = 'PRODUCT_UUID' 
  AND user_id = 'USER_UUID';`} />
          </DocumentSection>

          <DocumentSection title="4. Tabla: clients" level={1} id="clients">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Almacena la información completa de los clientes del sistema. 
              Centraliza datos de contacto, dirección y estadísticas de suscripciones activas.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE clients (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Información básica
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  tax_id TEXT,
  
  -- Dirección
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Paraguay',
  
  -- Estadísticas (actualizadas por triggers)
  total_spent BIGINT DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  total_subscriptions INTEGER DEFAULT 0,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  
  -- Metadatos
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_is_active ON clients(is_active);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>
            
            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Listar todos los clientes activos</h4>
            <CodeBlock language="sql" code={`SELECT id, name, email, phone_number, 
       active_subscriptions, total_spent
FROM clients
WHERE user_id = 'USER_UUID'
  AND is_active = true
ORDER BY created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Buscar cliente por email o nombre</h4>
            <CodeBlock language="sql" code={`SELECT * FROM clients
WHERE user_id = 'USER_UUID'
  AND (email ILIKE '%juan@email.com%' 
       OR name ILIKE '%Juan%');`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Crear nuevo cliente</h4>
            <CodeBlock language="sql" code={`INSERT INTO clients (
  user_id, name, email, phone_number, 
  address, city, country
) VALUES (
  'USER_UUID',
  'Juan Pérez',
  'juan@email.com',
  '+595981234567',
  'Av. Principal 123',
  'Asunción',
  'Paraguay'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Actualizar información del cliente</h4>
            <CodeBlock language="sql" code={`UPDATE clients
SET email = 'nuevo@email.com',
    phone_number = '+595981234568',
    updated_at = NOW()
WHERE id = 'CLIENT_UUID' 
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Top clientes por gasto total</h4>
            <CodeBlock language="sql" code={`SELECT name, email, 
       total_spent, 
       active_subscriptions,
       total_subscriptions
FROM clients
WHERE user_id = 'USER_UUID'
  AND is_active = true
ORDER BY total_spent DESC
LIMIT 10;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Clientes con suscripciones activas</h4>
            <CodeBlock language="sql" code={`SELECT name, email, active_subscriptions
FROM clients
WHERE user_id = 'USER_UUID'
  AND active_subscriptions > 0
ORDER BY active_subscriptions DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">7. Desactivar cliente (soft delete)</h4>
            <CodeBlock language="sql" code={`UPDATE clients
SET is_active = false,
    updated_at = NOW()
WHERE id = 'CLIENT_UUID' 
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">8. Cliente con sus suscripciones</h4>
            <CodeBlock language="sql" code={`SELECT c.name, c.email,
       s.reference, s.amount, s.status, s.next_charge_date
FROM clients c
LEFT JOIN subscriptions s ON c.id = s.client_id
WHERE c.id = 'CLIENT_UUID'
  AND c.user_id = 'USER_UUID'
ORDER BY s.next_charge_date ASC;`} />
          </DocumentSection>

          <DocumentSection title="5. Tabla: cards" level={1} id="cards">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Gestiona las tarjetas de crédito/débito registradas en el sistema. 
              Almacena tokens seguros y metadatos para procesamiento de pagos recurrentes.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE cards (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Información de la tarjeta
  token TEXT NOT NULL,  -- Token seguro del procesador
  last_four_digits TEXT NOT NULL,
  expiry_month TEXT NOT NULL,
  expiry_year TEXT NOT NULL,
  card_brand card_brand NOT NULL,  -- 'visa', 'mastercard', etc.
  cardholder_name TEXT NOT NULL,
  
  -- Estado y uso
  status card_status DEFAULT 'active',  -- 'active', 'expired', 'blocked', 'removed'
  is_default BOOLEAN DEFAULT false,
  last_used_at TIMESTAMPTZ,
  total_transactions INTEGER DEFAULT 0,
  
  -- Metadatos
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_client_id ON cards(client_id);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_token ON cards(token);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>
            
            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Listar tarjetas activas de un cliente</h4>
            <CodeBlock language="sql" code={`SELECT id, last_four_digits, card_brand, 
       expiry_month, expiry_year, 
       is_default, cardholder_name
FROM cards
WHERE user_id = 'USER_UUID'
  AND client_id = 'CLIENT_UUID'
  AND status = 'active'
ORDER BY is_default DESC, created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Registrar nueva tarjeta</h4>
            <CodeBlock language="sql" code={`INSERT INTO cards (
  user_id, client_id, token, last_four_digits,
  expiry_month, expiry_year, card_brand, 
  cardholder_name, is_default
) VALUES (
  'USER_UUID',
  'CLIENT_UUID',
  'tok_1234567890abcdef',
  '4242',
  '12',
  '2028',
  'visa',
  'Juan Pérez',
  true
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Establecer tarjeta como predeterminada</h4>
            <CodeBlock language="sql" code={`-- Primero quitar el default de todas las demás
UPDATE cards
SET is_default = false,
    updated_at = NOW()
WHERE client_id = 'CLIENT_UUID'
  AND user_id = 'USER_UUID';

-- Luego establecer la nueva como default
UPDATE cards
SET is_default = true,
    updated_at = NOW()
WHERE id = 'CARD_UUID'
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Tarjetas por vencer (próximos 3 meses)</h4>
            <CodeBlock language="sql" code={`SELECT c.last_four_digits, c.card_brand,
       c.expiry_month, c.expiry_year,
       cl.name as client_name, cl.email
FROM cards c
JOIN clients cl ON c.client_id = cl.id
WHERE c.user_id = 'USER_UUID'
  AND c.status = 'active'
  AND TO_DATE(c.expiry_year || '-' || c.expiry_month || '-01', 'YYYY-MM-DD')
      BETWEEN NOW() AND NOW() + INTERVAL '3 months'
ORDER BY c.expiry_year, c.expiry_month;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Actualizar uso de tarjeta</h4>
            <CodeBlock language="sql" code={`UPDATE cards
SET last_used_at = NOW(),
    total_transactions = total_transactions + 1,
    updated_at = NOW()
WHERE id = 'CARD_UUID'
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Bloquear tarjeta</h4>
            <CodeBlock language="sql" code={`UPDATE cards
SET status = 'blocked',
    updated_at = NOW()
WHERE id = 'CARD_UUID'
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">7. Eliminar tarjeta (soft delete)</h4>
            <CodeBlock language="sql" code={`UPDATE cards
SET status = 'removed',
    updated_at = NOW()
WHERE id = 'CARD_UUID'
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">8. Estadísticas de tarjetas por marca</h4>
            <CodeBlock language="sql" code={`SELECT card_brand,
       COUNT(*) as total_cards,
       SUM(total_transactions) as total_transactions
FROM cards
WHERE user_id = 'USER_UUID'
  AND status = 'active'
GROUP BY card_brand
ORDER BY total_cards DESC;`} />
          </DocumentSection>

          <DocumentSection title="6. Tabla: payment_links" level={1} id="payment_links">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Gestiona enlaces de pago únicos que pueden ser enviados a clientes 
              por diversos canales (WhatsApp, SMS, Email). Incluye tracking de visualizaciones y estados.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE payment_links (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  short_code TEXT UNIQUE,
  
  -- Relaciones
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Información del pago
  concept TEXT NOT NULL,
  description TEXT,
  amount BIGINT NOT NULL,
  
  -- Destinatario
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_email TEXT,
  
  -- Configuración
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 1,
  uses_count INTEGER DEFAULT 0,
  
  -- Estado y canal
  status payment_link_status DEFAULT 'active',
  channel payment_link_channel,  -- 'whatsapp', 'sms', 'email', 'manual'
  
  -- Tracking
  sent_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Notas y metadatos
  internal_notes TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_links_user_id ON payment_links(user_id);
CREATE INDEX idx_payment_links_token ON payment_links(token);
CREATE INDEX idx_payment_links_status ON payment_links(status);
CREATE INDEX idx_payment_links_client_id ON payment_links(client_id);
CREATE INDEX idx_payment_links_expires_at ON payment_links(expires_at);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>
            
            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Listar enlaces activos</h4>
            <CodeBlock language="sql" code={`SELECT id, concept, recipient_name, amount, 
       status, channel, expires_at, uses_count
FROM payment_links
WHERE user_id = 'USER_UUID'
  AND status IN ('active', 'sent', 'viewed')
ORDER BY created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Crear nuevo enlace de pago</h4>
            <CodeBlock language="sql" code={`INSERT INTO payment_links (
  user_id, token, concept, amount,
  recipient_name, recipient_phone, recipient_email,
  expires_at, channel
) VALUES (
  'USER_UUID',
  generate_payment_link_token(),
  'Pago mensual - Plan Premium',
  50000,
  'Juan Pérez',
  '+595981234567',
  'juan@email.com',
  NOW() + INTERVAL '7 days',
  'whatsapp'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Obtener enlace por token (para pago)</h4>
            <CodeBlock language="sql" code={`SELECT pl.*, 
       c.name as client_name,
       c.email as client_email
FROM payment_links pl
LEFT JOIN clients c ON pl.client_id = c.id
WHERE pl.token = 'TOKEN_FROM_URL'
  AND pl.status IN ('active', 'sent', 'viewed')
  AND (pl.expires_at IS NULL OR pl.expires_at > NOW());`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Actualizar estado a "enviado"</h4>
            <CodeBlock language="sql" code={`UPDATE payment_links
SET status = 'sent',
    sent_at = NOW(),
    updated_at = NOW()
WHERE id = 'LINK_UUID'
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Registrar primera visualización</h4>
            <CodeBlock language="sql" code={`UPDATE payment_links
SET status = 'viewed',
    first_viewed_at = COALESCE(first_viewed_at, NOW()),
    updated_at = NOW()
WHERE token = 'TOKEN_FROM_URL'
  AND status IN ('active', 'sent');`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Marcar como pagado</h4>
            <CodeBlock language="sql" code={`UPDATE payment_links
SET status = 'paid',
    paid_at = NOW(),
    uses_count = uses_count + 1,
    updated_at = NOW()
WHERE token = 'TOKEN_FROM_URL'
  AND status IN ('active', 'sent', 'viewed');`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">7. Enlaces expirados (para cleanup job)</h4>
            <CodeBlock language="sql" code={`UPDATE payment_links
SET status = 'expired',
    updated_at = NOW()
WHERE user_id = 'USER_UUID'
  AND status IN ('active', 'sent', 'viewed')
  AND expires_at < NOW()
RETURNING id, concept, recipient_name;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">8. Estadísticas de conversión por canal</h4>
            <CodeBlock language="sql" code={`SELECT channel,
       COUNT(*) as total_sent,
       SUM(CASE WHEN status = 'viewed' THEN 1 ELSE 0 END) as viewed,
       SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
       ROUND(
         SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)::numeric 
         / NULLIF(COUNT(*), 0) * 100, 
         2
       ) as conversion_rate,
       SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_revenue
FROM payment_links
WHERE user_id = 'USER_UUID'
  AND sent_at >= DATE_TRUNC('month', NOW())
GROUP BY channel
ORDER BY conversion_rate DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">9. Enlaces pendientes de envío</h4>
            <CodeBlock language="sql" code={`SELECT id, concept, recipient_name, 
       recipient_phone, amount, channel
FROM payment_links
WHERE user_id = 'USER_UUID'
  AND status = 'active'
  AND sent_at IS NULL
ORDER BY created_at ASC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">10. Cancelar enlace no usado</h4>
            <CodeBlock language="sql" code={`UPDATE payment_links
SET status = 'cancelled',
    updated_at = NOW()
WHERE id = 'LINK_UUID'
  AND user_id = 'USER_UUID'
  AND status IN ('active', 'sent', 'viewed');`} />
          </DocumentSection>

          <DocumentSection title="7. Tabla: subscriptions" level={1} id="subscriptions">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Representa las suscripciones activas de cada cliente. Contiene toda la información 
              necesaria para gestionar el ciclo de facturación, cobros recurrentes y estado de la suscripción.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE subscriptions (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  reference TEXT UNIQUE NOT NULL,
  
  -- Información del cliente
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  
  -- Configuración de suscripción
  type subscription_type NOT NULL,
  amount BIGINT NOT NULL,
  frequency subscription_frequency NOT NULL,
  concept TEXT NOT NULL,
  description TEXT,
  
  -- Estado y cobros
  status subscription_status DEFAULT 'active',
  billing_day INTEGER NOT NULL,
  next_charge_date TIMESTAMPTZ NOT NULL,
  last_charge_date TIMESTAMPTZ,
  
  -- Duración
  duration_type duration_type NOT NULL,
  number_of_payments INTEGER,
  payments_completed INTEGER DEFAULT 0,
  
  -- Primer cobro
  first_charge_type first_charge_type NOT NULL,
  first_charge_date TIMESTAMPTZ,
  first_payment_amount BIGINT,
  first_payment_reason TEXT,
  is_first_payment_completed BOOLEAN DEFAULT false,
  
  -- Trial
  trial_period_days INTEGER DEFAULT 0,
  
  -- Cambios de precio
  last_price_change_date TIMESTAMPTZ,
  price_change_history_count INTEGER DEFAULT 0,
  pending_price_change_id UUID,
  
  -- Configuraciones
  allow_pause BOOLEAN DEFAULT true,
  send_reminder_before_charge BOOLEAN DEFAULT true,
  created_from_product BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_charge_date ON subscriptions(next_charge_date);
CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Listar suscripciones activas</h4>
            <CodeBlock language="sql" code={`SELECT id, reference, client_name, amount, 
       status, next_charge_date
FROM subscriptions
WHERE user_id = 'USER_UUID'
  AND status = 'active'
ORDER BY next_charge_date ASC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Buscar por referencia o cliente</h4>
            <CodeBlock language="sql" code={`SELECT * FROM subscriptions
WHERE user_id = 'USER_UUID'
  AND (reference ILIKE '%REF123%' 
       OR client_name ILIKE '%Juan%'
       OR client_email ILIKE '%juan@email.com%');`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Suscripciones que vencen en los próximos 7 días</h4>
            <CodeBlock language="sql" code={`SELECT reference, client_name, next_charge_date, amount
FROM subscriptions
WHERE user_id = 'USER_UUID'
  AND status = 'active'
  AND next_charge_date BETWEEN NOW() 
      AND NOW() + INTERVAL '7 days'
ORDER BY next_charge_date ASC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Crear nueva suscripción</h4>
            <CodeBlock language="sql" code={`INSERT INTO subscriptions (
  user_id, reference, client_name, client_email, 
  phone_number, type, amount, frequency, concept, 
  billing_day, next_charge_date, duration_type, 
  first_charge_type, status
) VALUES (
  'USER_UUID', 
  'SUB-2025-001', 
  'Juan Pérez', 
  'juan@email.com', 
  '+595981234567',
  'fixed', 
  50000, 
  'monthly', 
  'Plan Premium', 
  15, 
  '2025-12-15',
  'unlimited', 
  'immediate', 
  'active'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Pausar una suscripción</h4>
            <CodeBlock language="sql" code={`UPDATE subscriptions
SET status = 'paused', 
    updated_at = NOW()
WHERE id = 'SUBSCRIPTION_UUID' 
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Reactivar suscripción pausada</h4>
            <CodeBlock language="sql" code={`UPDATE subscriptions
SET status = 'active', 
    next_charge_date = NOW() + INTERVAL '1 month',
    updated_at = NOW()
WHERE id = 'SUBSCRIPTION_UUID' 
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">7. Completar pago y actualizar fechas</h4>
            <CodeBlock language="sql" code={`UPDATE subscriptions
SET payments_completed = payments_completed + 1,
    last_charge_date = NOW(),
    next_charge_date = CASE frequency
      WHEN 'weekly' THEN next_charge_date + INTERVAL '7 days'
      WHEN 'monthly' THEN next_charge_date + INTERVAL '1 month'
      WHEN 'quarterly' THEN next_charge_date + INTERVAL '3 months'
      WHEN 'annual' THEN next_charge_date + INTERVAL '1 year'
    END,
    is_first_payment_completed = true,
    updated_at = NOW()
WHERE id = 'SUBSCRIPTION_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">8. Reporte de suscripciones por estado</h4>
            <CodeBlock language="sql" code={`SELECT status, 
       COUNT(*) as total, 
       SUM(amount) as total_amount
FROM subscriptions
WHERE user_id = 'USER_UUID'
GROUP BY status
ORDER BY total DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">9. Reporte de MRR (Monthly Recurring Revenue)</h4>
            <CodeBlock language="sql" code={`SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_subscriptions,
  SUM(amount) as monthly_revenue
FROM subscriptions
WHERE user_id = 'USER_UUID' 
  AND status = 'active'
GROUP BY month
ORDER BY month DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">10. Suscripciones con cambios de precio pendientes</h4>
            <CodeBlock language="sql" code={`SELECT s.reference, s.client_name, 
       s.amount as current_amount,
       spc.new_amount, spc.status as change_status
FROM subscriptions s
JOIN subscription_price_changes spc 
  ON s.pending_price_change_id = spc.id
WHERE s.user_id = 'USER_UUID'
  AND spc.status = 'pending';`} />
          </DocumentSection>

          <DocumentSection title="8. Tabla: subscription_price_changes" level={1} id="subscription_price_changes">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Gestiona los cambios de precio a nivel de suscripciones individuales. 
              Incluye funcionalidad de aprobación de clientes mediante tokens seguros y seguimiento completo del proceso.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE subscription_price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_price_change_id UUID REFERENCES product_price_changes(id),
  
  -- Montos
  old_amount BIGINT NOT NULL,
  new_amount BIGINT NOT NULL,
  difference BIGINT,
  percentage_change NUMERIC(5,2),
  
  -- Metadata del cambio
  change_type price_change_type NOT NULL,
  reason TEXT NOT NULL,
  internal_notes TEXT,
  changed_by TEXT,
  
  -- Aplicación
  application_type application_type NOT NULL,
  scheduled_date TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  
  -- Aprobación del cliente
  requires_client_approval BOOLEAN DEFAULT false,
  client_approval_status client_approval_status DEFAULT 'not_required',
  approval_token TEXT,
  client_notified BOOLEAN DEFAULT false,
  client_notified_at TIMESTAMPTZ,
  client_approval_date TIMESTAMPTZ,
  client_approval_method TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscription_price_changes_subscription ON subscription_price_changes(subscription_id);
CREATE INDEX idx_subscription_price_changes_status ON subscription_price_changes(status);
CREATE INDEX idx_subscription_price_changes_approval_token ON subscription_price_changes(approval_token);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Cambios pendientes de aprobación</h4>
            <CodeBlock language="sql" code={`SELECT spc.id, s.reference, s.client_name, 
       spc.old_amount, spc.new_amount, 
       spc.percentage_change, spc.reason,
       spc.client_approval_status
FROM subscription_price_changes spc
JOIN subscriptions s ON spc.subscription_id = s.id
WHERE s.user_id = 'USER_UUID'
  AND spc.status = 'pending'
  AND spc.requires_client_approval = true
ORDER BY spc.created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Crear cambio inmediato (sin aprobación)</h4>
            <CodeBlock language="sql" code={`INSERT INTO subscription_price_changes (
  subscription_id, old_amount, new_amount, 
  difference, percentage_change, change_type, 
  reason, application_type, requires_client_approval,
  client_approval_status, status
) VALUES (
  'SUBSCRIPTION_UUID', 
  50000, 
  60000, 
  10000, 
  20.0,
  'inflation', 
  'Ajuste por inflación anual', 
  'immediate', 
  false,
  'not_required', 
  'pending'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Crear cambio programado con aprobación</h4>
            <CodeBlock language="sql" code={`INSERT INTO subscription_price_changes (
  subscription_id, old_amount, new_amount, 
  difference, percentage_change, change_type, 
  reason, application_type, scheduled_date,
  requires_client_approval, client_approval_status, 
  approval_token, status
) VALUES (
  'SUBSCRIPTION_UUID', 
  50000, 
  75000, 
  25000, 
  50.0,
  'upgrade', 
  'Cambio a plan superior', 
  'scheduled', 
  '2025-12-01',
  true, 
  'pending', 
  generate_approval_token(), 
  'pending'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Aprobar cambio (desde enlace de cliente)</h4>
            <CodeBlock language="sql" code={`UPDATE subscription_price_changes
SET client_approval_status = 'approved',
    client_approval_date = NOW(),
    client_approval_method = 'link',
    updated_at = NOW()
WHERE approval_token = 'TOKEN_FROM_EMAIL'
  AND client_approval_status = 'pending'
RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Aplicar cambio de precio aprobado</h4>
            <CodeBlock language="sql" code={`-- Primero marcar el cambio como aplicado
UPDATE subscription_price_changes
SET status = 'applied',
    applied_at = NOW(),
    updated_at = NOW()
WHERE id = 'CHANGE_UUID' 
  AND status = 'pending';

-- Luego actualizar la suscripción
UPDATE subscriptions
SET amount = 60000,
    last_price_change_date = NOW(),
    price_change_history_count = price_change_history_count + 1,
    pending_price_change_id = NULL,
    updated_at = NOW()
WHERE id = 'SUBSCRIPTION_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Historial de cambios de una suscripción</h4>
            <CodeBlock language="sql" code={`SELECT change_type, old_amount, new_amount, 
       percentage_change, reason, applied_at,
       client_approval_status
FROM subscription_price_changes
WHERE subscription_id = 'SUBSCRIPTION_UUID'
ORDER BY created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">7. Validar enlace de aprobación</h4>
            <CodeBlock language="sql" code={`SELECT spc.*, s.client_name, s.client_email
FROM subscription_price_changes spc
JOIN subscriptions s ON spc.subscription_id = s.id
WHERE spc.approval_token = 'TOKEN_FROM_EMAIL'
  AND spc.client_approval_status = 'pending';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">8. Cancelar cambio pendiente</h4>
            <CodeBlock language="sql" code={`UPDATE subscription_price_changes
SET status = 'cancelled', 
    updated_at = NOW()
WHERE id = 'CHANGE_UUID' 
  AND status = 'pending';`} />
          </DocumentSection>

          <DocumentSection title="9. Tabla: product_price_changes" level={1} id="product_price_changes">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Gestiona cambios de precio masivos a nivel de producto que afectan múltiples suscripciones. 
              Incluye contadores para rastrear el progreso de aplicación.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE product_price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Montos
  old_base_amount BIGINT NOT NULL,
  new_base_amount BIGINT NOT NULL,
  difference BIGINT,
  percentage_change NUMERIC(5,2),
  
  -- Metadata
  change_type price_change_type NOT NULL,
  reason TEXT NOT NULL,
  internal_notes TEXT,
  changed_by TEXT,
  
  -- Aplicación
  application_type application_type NOT NULL,
  scheduled_date TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  
  -- Configuración para suscripciones fixed
  requires_approval_for_fixed BOOLEAN DEFAULT false,
  auto_suspend_fixed_until_approval BOOLEAN DEFAULT false,
  
  -- Contadores de progreso
  total_subscriptions_affected INTEGER DEFAULT 0,
  subscriptions_applied INTEGER DEFAULT 0,
  subscriptions_pending_approval INTEGER DEFAULT 0,
  subscriptions_failed INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_price_changes_product ON product_price_changes(product_id);
CREATE INDEX idx_product_price_changes_status ON product_price_changes(status);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Listar cambios de precio por producto</h4>
            <CodeBlock language="sql" code={`SELECT ppc.*, p.name as product_name
FROM product_price_changes ppc
JOIN products p ON ppc.product_id = p.id
WHERE p.user_id = 'USER_UUID'
ORDER BY ppc.created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Crear cambio masivo inmediato</h4>
            <CodeBlock language="sql" code={`INSERT INTO product_price_changes (
  product_id, old_base_amount, new_base_amount, 
  difference, percentage_change, change_type, 
  reason, application_type, 
  requires_approval_for_fixed, 
  auto_suspend_fixed_until_approval, status
) VALUES (
  'PRODUCT_UUID', 
  50000, 
  55000, 
  5000, 
  10.0,
  'inflation', 
  'Ajuste por inflación Q1 2025', 
  'immediate',
  false, 
  false, 
  'pending'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Ver progreso de aplicación</h4>
            <CodeBlock language="sql" code={`SELECT id, product_id, status,
       total_subscriptions_affected,
       subscriptions_applied,
       subscriptions_pending_approval,
       subscriptions_failed,
       ROUND(
         (subscriptions_applied::numeric / 
          NULLIF(total_subscriptions_affected, 0)) * 100, 
         2
       ) as progress_percentage
FROM product_price_changes
WHERE id = 'CHANGE_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Actualizar contadores al aplicar</h4>
            <CodeBlock language="sql" code={`UPDATE product_price_changes
SET subscriptions_applied = subscriptions_applied + 1,
    updated_at = NOW()
WHERE id = 'CHANGE_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Marcar como completado</h4>
            <CodeBlock language="sql" code={`UPDATE product_price_changes
SET status = 'applied',
    applied_at = NOW(),
    updated_at = NOW()
WHERE id = 'CHANGE_UUID'
  AND subscriptions_applied = total_subscriptions_affected;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Cambios pendientes de aplicación</h4>
            <CodeBlock language="sql" code={`SELECT ppc.*, p.name, p.active_subscriptions_count
FROM product_price_changes ppc
JOIN products p ON ppc.product_id = p.id
WHERE p.user_id = 'USER_UUID'
  AND ppc.status IN ('pending', 'applying')
ORDER BY ppc.scheduled_date ASC NULLS LAST;`} />
          </DocumentSection>

          <DocumentSection title="10. Tabla: notification_logs" level={1} id="notification_logs">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Registro de auditoría de todas las notificaciones enviadas a clientes 
              por diferentes canales (SMS, WhatsApp, Email). Incluye tracking de costos y estados.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  -- Destinatario
  phone_number TEXT NOT NULL,
  
  -- Canal y evento
  channel TEXT NOT NULL,  -- 'sms', 'whatsapp', 'email'
  event TEXT NOT NULL,    -- 'payment_reminder', 'price_change', etc.
  message TEXT NOT NULL,
  
  -- Estado
  status TEXT NOT NULL,   -- 'sent', 'failed', 'pending'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Costos (opcional)
  cost_amount NUMERIC(10,2),
  currency TEXT DEFAULT 'USD'
);

CREATE INDEX idx_notification_logs_subscription ON notification_logs(subscription_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Notificaciones recientes</h4>
            <CodeBlock language="sql" code={`SELECT nl.sent_at, nl.channel, nl.event, 
       s.client_name, nl.status
FROM notification_logs nl
JOIN subscriptions s ON nl.subscription_id = s.id
WHERE s.user_id = 'USER_UUID'
ORDER BY nl.sent_at DESC
LIMIT 50;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Notificaciones fallidas (reintentar)</h4>
            <CodeBlock language="sql" code={`SELECT nl.*, s.reference, s.client_name
FROM notification_logs nl
JOIN subscriptions s ON nl.subscription_id = s.id
WHERE s.user_id = 'USER_UUID'
  AND nl.status = 'failed'
  AND nl.sent_at > NOW() - INTERVAL '24 hours'
ORDER BY nl.sent_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Registrar notificación enviada</h4>
            <CodeBlock language="sql" code={`INSERT INTO notification_logs (
  subscription_id, phone_number, channel, 
  event, message, status, cost_amount
) VALUES (
  'SUBSCRIPTION_UUID', 
  '+595981234567', 
  'whatsapp', 
  'payment_reminder', 
  'Recordatorio: próximo cobro en 3 días', 
  'sent', 
  150
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Costo total por canal (mes actual)</h4>
            <CodeBlock language="sql" code={`SELECT channel, 
       COUNT(*) as total_sent,
       SUM(cost_amount) as total_cost,
       currency
FROM notification_logs nl
JOIN subscriptions s ON nl.subscription_id = s.id
WHERE s.user_id = 'USER_UUID'
  AND nl.sent_at >= DATE_TRUNC('month', NOW())
  AND nl.status = 'sent'
GROUP BY channel, currency
ORDER BY total_cost DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Historial de una suscripción</h4>
            <CodeBlock language="sql" code={`SELECT sent_at, channel, event, status, error_message
FROM notification_logs
WHERE subscription_id = 'SUBSCRIPTION_UUID'
ORDER BY sent_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Tasa de éxito por evento</h4>
            <CodeBlock language="sql" code={`SELECT event,
       COUNT(*) as total,
       SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
       ROUND(
         SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END)::numeric 
         / COUNT(*) * 100, 
         2
       ) as success_rate
FROM notification_logs nl
JOIN subscriptions s ON nl.subscription_id = s.id
WHERE s.user_id = 'USER_UUID'
GROUP BY event
ORDER BY success_rate ASC;`} />
          </DocumentSection>

          <DocumentSection title="11. Tabla: transactions" level={1} id="transactions">
            <p className="text-foreground/80 mb-4">
              <strong>Descripción:</strong> Registro de todas las transacciones de pago procesadas en el sistema.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Estructura de Columnas</h3>
            <CodeBlock language="sql" code={`CREATE TABLE transactions (
  -- Identificación
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  external_transaction_id TEXT,
  
  -- Relaciones
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  payment_link_id UUID REFERENCES payment_links(id) ON DELETE SET NULL,
  
  -- Información del cliente
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  
  -- Transacción
  concept TEXT,
  description TEXT,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'PYG',
  method TEXT NOT NULL,
  status transaction_status DEFAULT 'pending',
  
  -- Fallos
  failure_reason TEXT,
  
  -- Reembolsos
  refund_amount BIGINT,
  refunded_at TIMESTAMPTZ,
  
  -- Metadatos
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_card_id ON transactions(card_id);
CREATE INDEX idx_transactions_subscription_id ON transactions(subscription_id);
CREATE INDEX idx_transactions_payment_link_id ON transactions(payment_link_id);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplos SQL Comunes</h3>

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">1. Transacciones recientes con detalles completos</h4>
            <CodeBlock language="sql" code={`SELECT t.id, t.client_name, t.amount, t.method, 
       t.status, t.created_at,
       c.name as client,
       s.reference as subscription,
       pl.concept as payment_link_concept
FROM transactions t
LEFT JOIN clients c ON t.client_id = c.id
LEFT JOIN subscriptions s ON t.subscription_id = s.id
LEFT JOIN payment_links pl ON t.payment_link_id = pl.id
WHERE t.user_id = 'USER_UUID'
ORDER BY t.created_at DESC
LIMIT 50;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">2. Crear transacción de suscripción</h4>
            <CodeBlock language="sql" code={`INSERT INTO transactions (
  id, user_id, client_id, card_id, subscription_id,
  client_name, client_email, concept, 
  amount, currency, method, status
) VALUES (
  'TXN-2025-001', 
  'USER_UUID',
  'CLIENT_UUID',
  'CARD_UUID',
  'SUBSCRIPTION_UUID',
  'Juan Pérez', 
  'juan@email.com',
  'Cobro mensual - Plan Premium',
  50000,
  'PYG',
  'credit_card', 
  'pending'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">3. Crear transacción de payment link</h4>
            <CodeBlock language="sql" code={`INSERT INTO transactions (
  id, user_id, client_id, payment_link_id,
  client_name, client_email, concept,
  amount, currency, method, status
) VALUES (
  'TXN-2025-002',
  'USER_UUID',
  'CLIENT_UUID',
  'PAYMENT_LINK_UUID',
  'María López',
  'maria@email.com',
  'Pago único - Servicio',
  75000,
  'PYG',
  'qr_code',
  'completed'
) RETURNING *;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">4. Actualizar estado a completado</h4>
            <CodeBlock language="sql" code={`UPDATE transactions
SET status = 'completed',
    external_transaction_id = 'EXT-123456',
    updated_at = NOW()
WHERE id = 'TXN-2025-001' 
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">5. Registrar transacción fallida</h4>
            <CodeBlock language="sql" code={`UPDATE transactions
SET status = 'failed',
    failure_reason = 'Fondos insuficientes',
    updated_at = NOW()
WHERE id = 'TXN-2025-001'
  AND user_id = 'USER_UUID';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">6. Procesar reembolso</h4>
            <CodeBlock language="sql" code={`UPDATE transactions
SET refund_amount = 50000,
    refunded_at = NOW(),
    updated_at = NOW()
WHERE id = 'TXN-2025-001'
  AND user_id = 'USER_UUID'
  AND status = 'completed';`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">7. Transacciones fallidas del día</h4>
            <CodeBlock language="sql" code={`SELECT t.id, t.client_name, t.amount, t.method, 
       t.failure_reason, t.created_at,
       c.email, c.phone_number
FROM transactions t
LEFT JOIN clients c ON t.client_id = c.id
WHERE t.user_id = 'USER_UUID'
  AND t.status = 'failed'
  AND t.created_at >= DATE_TRUNC('day', NOW())
ORDER BY t.created_at DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">8. Reporte por método de pago</h4>
            <CodeBlock language="sql" code={`SELECT method,
       COUNT(*) as total_transactions,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
       SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount,
       AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_amount
FROM transactions
WHERE user_id = 'USER_UUID'
  AND created_at >= DATE_TRUNC('month', NOW())
GROUP BY method
ORDER BY total_amount DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">9. Ingresos diarios (último mes)</h4>
            <CodeBlock language="sql" code={`SELECT DATE_TRUNC('day', created_at) as day,
       COUNT(*) as transactions,
       SUM(amount) as daily_revenue,
       SUM(CASE WHEN refund_amount IS NOT NULL THEN refund_amount ELSE 0 END) as refunds,
       SUM(amount) - SUM(CASE WHEN refund_amount IS NOT NULL THEN refund_amount ELSE 0 END) as net_revenue
FROM transactions
WHERE user_id = 'USER_UUID'
  AND status = 'completed'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">10. Transacciones por tarjeta</h4>
            <CodeBlock language="sql" code={`SELECT cd.last_four_digits, cd.card_brand,
       COUNT(*) as total_transactions,
       SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as successful,
       SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as total_amount
FROM transactions t
JOIN cards cd ON t.card_id = cd.id
WHERE t.user_id = 'USER_UUID'
  AND t.created_at >= DATE_TRUNC('month', NOW())
GROUP BY cd.id, cd.last_four_digits, cd.card_brand
ORDER BY total_amount DESC;`} />

            <h4 className="text-md font-medium text-foreground mt-4 mb-2">11. Historial de cliente con detalles</h4>
            <CodeBlock language="sql" code={`SELECT t.id, t.concept, t.amount, t.currency,
       t.method, t.status, t.created_at,
       t.refund_amount, t.failure_reason,
       s.reference as subscription_ref
FROM transactions t
LEFT JOIN subscriptions s ON t.subscription_id = s.id
WHERE t.client_id = 'CLIENT_UUID'
  AND t.user_id = 'USER_UUID'
ORDER BY t.created_at DESC;`} />
          </DocumentSection>

          <DocumentSection title="9. Funciones de Base de Datos" level={1}>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">1. handle_updated_at()</h3>
            <p className="text-foreground/80 mb-4">
              Trigger function para actualizar automáticamente el campo updated_at cuando se modifica un registro.
            </p>
            <CodeBlock language="sql" code={`CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar a todas las tablas con updated_at:
CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Repetir para todas las tablas necesarias`} />

            <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">2. generate_approval_token()</h3>
            <p className="text-foreground/80 mb-4">
              Genera tokens seguros aleatorios para enlaces de aprobación de clientes.
            </p>
            <CodeBlock language="sql" code={`CREATE OR REPLACE FUNCTION public.generate_approval_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Uso:
SELECT generate_approval_token();
-- Resultado: 'kS8vX2mN9pQ...' (44 caracteres)`} />

            <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">3. generate_payment_link_token()</h3>
            <p className="text-foreground/80 mb-4">
              Genera tokens únicos para enlaces de pago.
            </p>
            <CodeBlock language="sql" code={`CREATE OR REPLACE FUNCTION public.generate_payment_link_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Uso:
SELECT generate_payment_link_token();
-- Resultado: 'a7f3c9e1...' (64 caracteres hex)`} />

            <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">4. expire_payment_links()</h3>
            <p className="text-foreground/80 mb-4">
              Función para marcar automáticamente como expirados los payment links que han vencido. 
              Se puede ejecutar periódicamente mediante un cron job.
            </p>
            <CodeBlock language="sql" code={`CREATE OR REPLACE FUNCTION public.expire_payment_links()
RETURNS VOID AS $$
BEGIN
  UPDATE public.payment_links
  SET status = 'expired',
      updated_at = NOW()
  WHERE status IN ('active', 'sent', 'viewed')
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Uso (ejecutar periódicamente):
SELECT expire_payment_links();`} />
          </DocumentSection>

          <DocumentSection title="10. Políticas RLS (Row Level Security)" level={1}>
            <p className="text-foreground/80 mb-4">
              El sistema implementa Row Level Security para garantizar que los usuarios solo puedan acceder a sus propios datos.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla products</h3>
            <CodeBlock language="sql" code={`ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own products"
ON products FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla subscriptions</h3>
            <CodeBlock language="sql" code={`ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions"
ON subscriptions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla subscription_price_changes</h3>
            <CodeBlock language="sql" code={`ALTER TABLE subscription_price_changes ENABLE ROW LEVEL SECURITY;

-- Usuario propietario puede ver sus cambios
CREATE POLICY "Users can view their subscription price changes"
ON subscription_price_changes FOR SELECT
TO authenticated
USING (subscription_id IN (
  SELECT id FROM subscriptions WHERE user_id = auth.uid()
));

-- Acceso público con token para aprobaciones
CREATE POLICY "Anyone with token can view for approval"
ON subscription_price_changes FOR SELECT
USING (approval_token IS NOT NULL);

-- Usuario puede actualizar aprobaciones
CREATE POLICY "Anyone with token can update approval"
ON subscription_price_changes FOR UPDATE
USING (approval_token IS NOT NULL);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla clients</h3>
            <CodeBlock language="sql" code={`ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
ON clients FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla cards</h3>
            <CodeBlock language="sql" code={`ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cards"
ON cards FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
ON cards FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON cards FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
ON cards FOR DELETE
TO authenticated
USING (auth.uid() = user_id);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla payment_links</h3>
            <CodeBlock language="sql" code={`ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus propios enlaces
CREATE POLICY "Users can manage their own payment links"
ON payment_links FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Acceso público con token para pago
CREATE POLICY "Anyone with token can view payment link"
ON payment_links FOR SELECT
USING (token IS NOT NULL);`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tabla transactions</h3>
            <CodeBlock language="sql" code={`ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
ON transactions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);`} />
          </DocumentSection>

          <DocumentSection title="11. Guía de Integración con Java/Spring Boot" level={1}>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Mapeo de Tipos PostgreSQL → Java</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">PostgreSQL</th>
                    <th className="border border-border p-2 text-left">Java (JPA)</th>
                    <th className="border border-border p-2 text-left">Ejemplo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">uuid</td>
                    <td className="border border-border p-2">UUID / String</td>
                    <td className="border border-border p-2">@Id UUID id;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">text</td>
                    <td className="border border-border p-2">String</td>
                    <td className="border border-border p-2">String name;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">bigint</td>
                    <td className="border border-border p-2">Long</td>
                    <td className="border border-border p-2">Long amount;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">integer</td>
                    <td className="border border-border p-2">Integer</td>
                    <td className="border border-border p-2">Integer billingDay;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">boolean</td>
                    <td className="border border-border p-2">Boolean</td>
                    <td className="border border-border p-2">Boolean isActive;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">numeric</td>
                    <td className="border border-border p-2">BigDecimal</td>
                    <td className="border border-border p-2">BigDecimal percentage;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">timestamptz</td>
                    <td className="border border-border p-2">Instant / ZonedDateTime</td>
                    <td className="border border-border p-2">Instant createdAt;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">jsonb</td>
                    <td className="border border-border p-2">String / Map</td>
                    <td className="border border-border p-2">@Type(JsonType) Map metadata;</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">ENUM</td>
                    <td className="border border-border p-2">Java Enum</td>
                    <td className="border border-border p-2">@Enumerated SubscriptionType type;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Configuración JDBC</h3>
            <CodeBlock language="properties" code={`# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/subscriptions_db
    username: postgres
    password: your_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Ejemplo de Entidad JPA</h3>
            <CodeBlock language="java" code={`@Entity
@Table(name = "subscriptions")
public class Subscription {
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(nullable = false, unique = true)
    private String reference;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(nullable = false)
    private Long amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;
    
    @Column(name = "next_charge_date", nullable = false)
    private Instant nextChargeDate;
    
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
    
    // Getters y Setters
}`} />

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Queries con Spring Data JPA</h3>
            <CodeBlock language="java" code={`public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    
    // Queries derivadas del nombre del método
    List<Subscription> findByUserIdAndStatus(UUID userId, SubscriptionStatus status);
    
    List<Subscription> findByUserIdAndStatusAndNextChargeDateBetween(
        UUID userId, 
        SubscriptionStatus status,
        Instant start, 
        Instant end
    );
    
    // Queries con @Query
    @Query("SELECT s FROM Subscription s WHERE s.userId = :userId " +
           "AND (s.reference LIKE %:search% OR s.clientName LIKE %:search%)")
    List<Subscription> searchByUserAndTerm(
        @Param("userId") UUID userId, 
        @Param("search") String search
    );
    
    // Query nativa
    @Query(value = "SELECT status, COUNT(*) as total, SUM(amount) as total_amount " +
                   "FROM subscriptions WHERE user_id = :userId " +
                   "GROUP BY status", 
           nativeQuery = true)
    List<Object[]> getSubscriptionStatsByUser(@Param("userId") UUID userId);
}`} />
          </DocumentSection>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              <FileText className="inline mr-2 h-5 w-5" />
              Recursos Adicionales
            </h3>
            <ul className="space-y-2 text-foreground/80">
              <li>• Para migraciones desde Deno/TypeScript a Java/Spring Boot, consulta la <a href="/docs/java-migration" className="text-primary hover:underline">Guía de Migración Java</a></li>
              <li>• Documentación oficial de PostgreSQL: <a href="https://www.postgresql.org/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">postgresql.org/docs</a></li>
              <li>• Spring Data JPA: <a href="https://spring.io/projects/spring-data-jpa" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">spring.io/projects/spring-data-jpa</a></li>
            </ul>
          </div>
        </Card>

        <style>{`
          @media print {
            .no-print {
              display: none !important;
            }
            
            .page-break-before {
              page-break-before: always;
            }
            
            .documentation-content {
              box-shadow: none !important;
              border: none !important;
            }
            
            pre {
              page-break-inside: avoid;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            
            table {
              page-break-inside: avoid;
              font-size: 10px;
            }
            
            h1, h2, h3 {
              page-break-after: avoid;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
